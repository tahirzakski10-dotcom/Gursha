"""
Ethiopian Food Recognition - Transfer Learning Training Script
================================================================

A production-ready training script for fine-tuning pre-trained models 
on Ethiopian food images using the Hugging Face Ethiopian-foods dataset.

Features:
- Transfer learning with EfficientNet-B0, ResNet50, or MobileNetV3
- Advanced data augmentation strategies
- Automatic GPU detection and optimization
- Early stopping and best model checkpointing
- Comprehensive metrics tracking and visualization
- Learning rate scheduling and optimization

Author: ML Engineering Team
Version: 1.0
"""

import os
import json
import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim.lr_scheduler import ReduceLROnPlateau
from torch.utils.data import DataLoader, random_split
import torchvision.transforms as transforms
from torchvision import models
import timm
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datasets import load_dataset
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
from tqdm import tqdm
import warnings
warnings.filterwarnings('ignore')

# ============================================================================
# CONFIGURATION
# ============================================================================

class Config:
    """Centralized configuration for training parameters"""
    
    # Model Configuration
    MODEL_NAME = "efficientnet_b0"  # Options: efficientnet_b0, resnet50, mobilenetv3_small
    NUM_CLASSES = 11
    PRETRAINED = True
    
    # Dataset Configuration
    DATASET_NAME = "zakir22/Ethiopian-foods"
    TRAIN_SPLIT = 0.8
    VALIDATION_SPLIT = 0.2
    
    # Training Configuration
    BATCH_SIZE = 32
    NUM_EPOCHS = 1
    LEARNING_RATE = 1e-3
    WEIGHT_DECAY = 1e-4
    PATIENCE = 15  # Early stopping patience
    
    # Optimization
    WARMUP_EPOCHS = 5
    
    # Data Augmentation
    IMAGE_SIZE = 224
    MEAN = [0.485, 0.456, 0.406]
    STD = [0.229, 0.224, 0.225]
    
    # Device
    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # Checkpointing
    CHECKPOINT_DIR = "./checkpoints"
    MODEL_SAVE_PATH = "./model.pt"
    CLASS_NAMES_PATH = "./class_names.json"
    
    # Logging
    VERBOSE = True
    
    @classmethod
    def print_config(cls):
        """Print configuration to console"""
        if cls.VERBOSE:
            print("\n" + "="*70)
            print("TRAINING CONFIGURATION")
            print("="*70)
            print(f"Model: {cls.MODEL_NAME}")
            print(f"Number of Classes: {cls.NUM_CLASSES}")
            print(f"Batch Size: {cls.BATCH_SIZE}")
            print(f"Learning Rate: {cls.LEARNING_RATE}")
            print(f"Number of Epochs: {cls.NUM_EPOCHS}")
            print(f"Device: {cls.DEVICE}")
            print(f"Train/Val Split: {cls.TRAIN_SPLIT}/{cls.VALIDATION_SPLIT}")
            print("="*70 + "\n")


# ============================================================================
# DATA AUGMENTATION TRANSFORMATIONS
# ============================================================================

def get_transforms(is_training=True):
    """
    Create data augmentation pipelines for training and validation.
    
    Training transforms include strong augmentation strategies to maximize
    model robustness on the small dataset (1,097 images).
    
    Args:
        is_training (bool): If True, apply training augmentations; 
                           else apply validation transforms only.
    
    Returns:
        transforms.Compose: Composition of PyTorch transforms.
    """
    
    if is_training:
        # Strong augmentation strategy for improved generalization
        # and robustness on small dataset
        return transforms.Compose([
            # Random resized crop: 80-100% of image, aspect ratio 0.75-1.33
            transforms.RandomResizedCrop(
                Config.IMAGE_SIZE,
                scale=(0.8, 1.0),
                ratio=(0.75, 1.33),
                interpolation=transforms.InterpolationMode.BILINEAR
            ),
            # Random horizontal flip (common for food images)
            transforms.RandomHorizontalFlip(p=0.5),
            # Random rotation for slight variations
            transforms.RandomRotation(degrees=15),
            # Color jittering for robustness to lighting variations
            transforms.ColorJitter(
                brightness=0.2,
                contrast=0.2,
                saturation=0.2,
                hue=0.1
            ),
            # Random Gaussian blur for robustness
            transforms.GaussianBlur(kernel_size=3, sigma=(0.1, 2.0)),
            # Random vertical flip (less common for food)
            transforms.RandomVerticalFlip(p=0.1),
            # Convert to tensor and normalize
            transforms.ToTensor(),
            transforms.Normalize(
                mean=Config.MEAN,
                std=Config.STD
            ),
        ])
    else:
        # Validation transforms: minimal augmentation
        return transforms.Compose([
            # Resize to exact dimensions
            transforms.Resize((Config.IMAGE_SIZE, Config.IMAGE_SIZE)),
            # Convert to tensor and normalize
            transforms.ToTensor(),
            transforms.Normalize(
                mean=Config.MEAN,
                std=Config.STD
            ),
        ])


# ============================================================================
# CUSTOM DATASET CLASS
# ============================================================================

class EthiopianFoodDataset(torch.utils.data.Dataset):
    """
    Custom PyTorch Dataset for Ethiopian food images from Hugging Face.
    
    Handles image loading, transformation, and label mapping.
    """
    
    def __init__(self, hf_dataset, class_to_idx, transform=None):
        """
        Initialize dataset.
        
        Args:
            hf_dataset: Hugging Face dataset object
            class_to_idx (dict): Mapping from class name to index
            transform: PyTorch transforms to apply
        """
        self.data = hf_dataset
        self.class_to_idx = class_to_idx
        self.transform = transform
        
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        """
        Get a single sample.
        
        Args:
            idx (int): Index of sample
            
        Returns:
            tuple: (image_tensor, label_index)
        """
        sample = self.data[idx]
        
        image_data = sample['image']
        if isinstance(image_data, dict) and 'bytes' in image_data:
            from io import BytesIO
            from PIL import Image
            image = Image.open(BytesIO(image_data['bytes']))
        elif isinstance(image_data, dict) and 'path' in image_data:
            from PIL import Image
            image = Image.open(image_data['path'])
        else:
            image = image_data
            
        # Extract class name from text field or use image field
        label_name = sample.get('text', '')
        
        # Convert image to RGB if needed (handle RGBA, grayscale, etc.)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Apply transforms
        if self.transform:
            image = self.transform(image)
        
        # Get label index
        label_idx = self.class_to_idx.get(label_name, 0)
        
        return image, label_idx


# ============================================================================
# MODEL BUILDER
# ============================================================================

def build_model(model_name, num_classes, pretrained=True):
    """
    Build transfer learning model with custom classification head.
    
    Supports multiple architectures optimized for different use cases:
    - EfficientNet-B0: Best balance of accuracy and speed
    - ResNet50: High accuracy, moderate speed
    - MobileNetV3: Fastest inference, lighter model
    
    Args:
        model_name (str): Name of model architecture
        num_classes (int): Number of output classes
        pretrained (bool): Use pretrained ImageNet weights
    
    Returns:
        nn.Module: Model ready for training
    """
    
    if Config.VERBOSE:
        print(f"\nLoading {model_name} with pretrained={pretrained}...")
    
    if model_name == "efficientnet_b0":
        # EfficientNet-B0: Optimal for transfer learning
        # Computational efficiency with high accuracy
        model = timm.create_model('efficientnet_b0', pretrained=pretrained)
        in_features = model.classifier.in_features
        model.classifier = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(in_features, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, num_classes)
        )
    
    elif model_name == "resnet50":
        # ResNet50: Well-established, high accuracy
        model = models.resnet50(weights='IMAGENET1K_V2' if pretrained else None)
        in_features = model.fc.in_features
        model.fc = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(in_features, 512),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(512, num_classes)
        )
    
    elif model_name == "mobilenetv3_small":
        # MobileNetV3: Lightweight, fast inference
        model = models.mobilenet_v3_small(weights='IMAGENET1K_V1' if pretrained else None)
        in_features = model.classifier[3].in_features
        model.classifier = nn.Sequential(
            nn.Linear(in_features, 128),
            nn.Hardswish(),
            nn.Dropout(0.2),
            nn.Linear(128, num_classes)
        )
    
    else:
        raise ValueError(f"Unknown model: {model_name}")
    
    model = model.to(Config.DEVICE)
    
    if Config.VERBOSE:
        print(f"Model loaded successfully!")
        print(f"Total parameters: {sum(p.numel() for p in model.parameters()):,}")
        print(f"Trainable parameters: {sum(p.numel() for p in model.parameters() if p.requires_grad):,}")
    
    return model


# ============================================================================
# TRAINING UTILITIES
# ============================================================================

class EarlyStopping:
    """
    Early stopping callback to prevent overfitting.
    
    Monitors validation loss and stops training if it doesn't improve
    for a specified number of epochs.
    """
    
    def __init__(self, patience=15, verbose=True, delta=0.001):
        """
        Initialize early stopping.
        
        Args:
            patience (int): Number of epochs with no improvement to wait
            verbose (bool): Print messages
            delta (float): Minimum change to qualify as improvement
        """
        self.patience = patience
        self.verbose = verbose
        self.delta = delta
        self.counter = 0
        self.best_loss = None
        self.early_stop = False
    
    def __call__(self, val_loss):
        """
        Check if training should stop.
        
        Args:
            val_loss (float): Validation loss
        """
        if self.best_loss is None:
            self.best_loss = val_loss
        elif val_loss < self.best_loss - self.delta:
            self.best_loss = val_loss
            self.counter = 0
        else:
            self.counter += 1
            if self.counter >= self.patience:
                self.early_stop = True
                if self.verbose:
                    print(f"Early stopping triggered after {self.patience} epochs without improvement.")


def train_epoch(model, train_loader, criterion, optimizer, device):
    """
    Train for one epoch.
    
    Args:
        model: Neural network model
        train_loader: DataLoader for training data
        criterion: Loss function
        optimizer: Optimization algorithm
        device: torch.device (cuda or cpu)
    
    Returns:
        float: Average training loss
    """
    model.train()
    total_loss = 0.0
    correct = 0
    total = 0
    
    progress_bar = tqdm(train_loader, desc="Training", leave=False)
    
    for images, labels in progress_bar:
        # Move to device
        images, labels = images.to(device), labels.to(device)
        
        # Forward pass
        outputs = model(images)
        loss = criterion(outputs, labels)
        
        # Backward pass and optimization
        optimizer.zero_grad()
        loss.backward()
        
        # Gradient clipping for stability
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        
        optimizer.step()
        
        # Statistics
        total_loss += loss.item()
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()
        
        # Update progress bar
        progress_bar.set_postfix({'loss': loss.item()})
    
    avg_loss = total_loss / len(train_loader)
    accuracy = 100 * correct / total
    
    return avg_loss, accuracy


def validate(model, val_loader, criterion, device):
    """
    Validate model on validation set.
    
    Args:
        model: Neural network model
        val_loader: DataLoader for validation data
        criterion: Loss function
        device: torch.device (cuda or cpu)
    
    Returns:
        tuple: (average_loss, accuracy, predictions, true_labels, confidences)
    """
    model.eval()
    total_loss = 0.0
    correct = 0
    total = 0
    
    all_predictions = []
    all_labels = []
    all_confidences = []
    
    with torch.no_grad():
        progress_bar = tqdm(val_loader, desc="Validating", leave=False)
        
        for images, labels in progress_bar:
            # Move to device
            images, labels = images.to(device), labels.to(device)
            
            # Forward pass
            outputs = model(images)
            loss = criterion(outputs, labels)
            
            # Statistics
            total_loss += loss.item()
            probabilities = torch.softmax(outputs, dim=1)
            confidences, predicted = torch.max(probabilities, 1)
            
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
            # Store predictions
            all_predictions.extend(predicted.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            all_confidences.extend(confidences.cpu().numpy())
    
    avg_loss = total_loss / len(val_loader)
    accuracy = 100 * correct / total
    
    return avg_loss, accuracy, all_predictions, all_labels, all_confidences


def compute_per_class_accuracy(predictions, labels, num_classes):
    """
    Compute per-class accuracy.
    
    Args:
        predictions (array): Model predictions
        labels (array): True labels
        num_classes (int): Number of classes
    
    Returns:
        dict: Per-class accuracy
    """
    per_class_acc = {}
    for class_idx in range(num_classes):
        class_mask = np.array(labels) == class_idx
        if class_mask.sum() > 0:
            class_accuracy = np.array(predictions)[class_mask] == class_idx
            per_class_acc[class_idx] = 100 * class_accuracy.mean()
        else:
            per_class_acc[class_idx] = 0.0
    return per_class_acc


# ============================================================================
# DATA LOADING AND PREPARATION
# ============================================================================

def load_and_prepare_data():
    """
    Load Ethiopian foods dataset from Hugging Face and prepare data loaders.
    
    Returns:
        tuple: (train_loader, val_loader, class_names, class_to_idx)
    """
    
    print("\n" + "="*70)
    print("LOADING DATASET FROM HUGGING FACE")
    print("="*70)
    
    # Load dataset from local parquet file
    print(f"\nLoading dataset from local parquet file: {os.path.join(os.path.dirname(__file__), 'train-00000-of-00001-bc899d0c1bd10458.parquet')}")
    dataset = load_dataset("parquet", data_files=os.path.join(os.path.dirname(__file__), "train-00000-of-00001-bc899d0c1bd10458.parquet"))
    
    # Get the dataset split (usually 'train')
    if 'train' in dataset:
        full_dataset = dataset['train']
    else:
        full_dataset = dataset
    
    print(f"Total samples: {len(full_dataset)}")
    
    # Extract unique class names
    unique_texts = set()
    for sample in full_dataset:
        text = sample.get('text', '')
        if text:
            unique_texts.add(text)
    
    class_names = sorted(list(unique_texts))
    num_classes = len(class_names)
    
    print(f"Number of classes detected: {num_classes}")
    print(f"Classes: {class_names}")
    
    # Create mapping
    class_to_idx = {name: idx for idx, name in enumerate(class_names)}
    idx_to_class = {idx: name for name, idx in class_to_idx.items()}
    
    if Config.VERBOSE:
        print(f"\nClass mapping: {class_to_idx}")
    
    # Split into train and validation
    train_size = int(Config.TRAIN_SPLIT * len(full_dataset))
    val_size = len(full_dataset) - train_size
    
    train_data, val_data = random_split(
        full_dataset,
        [train_size, val_size],
        generator=torch.Generator().manual_seed(42)
    )
    
    print(f"\nTraining samples: {len(train_data)}")
    print(f"Validation samples: {len(val_data)}")
    
    # Create PyTorch datasets with transforms
    train_dataset = EthiopianFoodDataset(
        train_data.dataset.select(train_data.indices),
        class_to_idx,
        transform=get_transforms(is_training=True)
    )
    
    val_dataset = EthiopianFoodDataset(
        val_data.dataset.select(val_data.indices),
        class_to_idx,
        transform=get_transforms(is_training=False)
    )
    
    # Create data loaders
    train_loader = DataLoader(
        train_dataset,
        batch_size=Config.BATCH_SIZE,
        shuffle=True,
        num_workers=0,  # Set to 0 for Windows compatibility
        pin_memory=True if Config.DEVICE.type == 'cuda' else False
    )
    
    val_loader = DataLoader(
        val_dataset,
        batch_size=Config.BATCH_SIZE,
        shuffle=False,
        num_workers=0,
        pin_memory=True if Config.DEVICE.type == 'cuda' else False
    )
    
    print("\n" + "="*70)
    
    return train_loader, val_loader, class_names, class_to_idx


# ============================================================================
# TRAINING LOOP
# ============================================================================

def train():
    """
    Main training loop with validation, early stopping, and checkpointing.
    """
    
    Config.print_config()
    
    # Create checkpoint directory
    os.makedirs(Config.CHECKPOINT_DIR, exist_ok=True)
    
    # Load data
    train_loader, val_loader, class_names, class_to_idx = load_and_prepare_data()
    
    # Build model
    model = build_model(Config.MODEL_NAME, len(class_names), Config.PRETRAINED)
    
    # Loss function (weighted for imbalanced dataset if needed)
    criterion = nn.CrossEntropyLoss()
    
    # Optimizer with weight decay for regularization
    optimizer = optim.AdamW(
        model.parameters(),
        lr=Config.LEARNING_RATE,
        weight_decay=Config.WEIGHT_DECAY
    )
    
    scheduler = ReduceLROnPlateau(
        optimizer,
        mode='min',
        factor=0.5,
        patience=5,
        min_lr=1e-6
    )
    
    # Early stopping
    early_stopping = EarlyStopping(patience=Config.PATIENCE, verbose=Config.VERBOSE)
    
    # Training history
    history = {
        'train_loss': [],
        'val_loss': [],
        'train_accuracy': [],
        'val_accuracy': [],
        'learning_rate': []
    }
    
    best_val_loss = float('inf')
    best_model_path = os.path.join(Config.CHECKPOINT_DIR, 'best_model.pt')
    
    print("\n" + "="*70)
    print("STARTING TRAINING")
    print("="*70 + "\n")
    
    # Training loop
    for epoch in range(Config.NUM_EPOCHS):
        # Train
        train_loss, train_acc = train_epoch(
            model, train_loader, criterion, optimizer, Config.DEVICE
        )
        
        # Validate
        val_loss, val_acc, predictions, labels, confidences = validate(
            model, val_loader, criterion, Config.DEVICE
        )
        
        # Per-class accuracy
        per_class_acc = compute_per_class_accuracy(predictions, labels, Config.NUM_CLASSES)
        
        # Update history
        history['train_loss'].append(train_loss)
        history['val_loss'].append(val_loss)
        history['train_accuracy'].append(train_acc)
        history['val_accuracy'].append(val_acc)
        history['learning_rate'].append(optimizer.param_groups[0]['lr'])
        
        # Print progress
        print(f"\nEpoch [{epoch+1}/{Config.NUM_EPOCHS}]")
        print(f"  Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}%")
        print(f"  Val Loss:   {val_loss:.4f} | Val Acc:   {val_acc:.2f}%")
        print(f"  Learning Rate: {optimizer.param_groups[0]['lr']:.2e}")
        
        # Save best model
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), best_model_path)
            if Config.VERBOSE:
                print(f"  [OK] Best model saved (Val Loss: {val_loss:.4f})")
        
        # Learning rate scheduling
        scheduler.step(val_loss)
        
        # Early stopping check
        early_stopping(val_loss)
        if early_stopping.early_stop:
            print(f"\nTraining stopped early at epoch {epoch+1}")
            break
    
    # Load best model
    print("\n" + "="*70)
    print("LOADING BEST MODEL")
    print("="*70)
    model.load_state_dict(torch.load(best_model_path, map_location=Config.DEVICE))
    
    # Final validation with best model
    final_val_loss, final_val_acc, predictions, labels, confidences = validate(
        model, val_loader, criterion, Config.DEVICE
    )
    
    print(f"\nBest Model Performance:")
    print(f"  Validation Loss: {final_val_loss:.4f}")
    print(f"  Validation Accuracy: {final_val_acc:.2f}%")
    
    # Per-class metrics
    per_class_acc = compute_per_class_accuracy(predictions, labels, Config.NUM_CLASSES)
    print("\nPer-Class Accuracy:")
    for class_idx, class_name in enumerate(class_names):
        print(f"  {class_name}: {per_class_acc[class_idx]:.2f}%")
    
    # Confusion Matrix
    cm = confusion_matrix(labels, predictions)
    
    # Save model and class names
    print("\n" + "="*70)
    print("SAVING MODEL AND METADATA")
    print("="*70)
    
    # Save model
    torch.save(model.state_dict(), Config.MODEL_SAVE_PATH)
    print(f"\nModel saved to: {Config.MODEL_SAVE_PATH}")
    
    # Save class names
    with open(Config.CLASS_NAMES_PATH, 'w') as f:
        json.dump(class_names, f, indent=2)
    print(f"Class names saved to: {Config.CLASS_NAMES_PATH}")
    
    # Save training history
    history_path = "./training_history.json"
    with open(history_path, 'w') as f:
        json.dump(history, f, indent=2)
    print(f"Training history saved to: {history_path}")
    
    # Visualizations
    print("\nGenerating visualizations...")
    
    # Plot training curves
    fig, axes = plt.subplots(1, 2, figsize=(14, 4))
    
    # Loss curve
    axes[0].plot(history['train_loss'], label='Training Loss', marker='o')
    axes[0].plot(history['val_loss'], label='Validation Loss', marker='s')
    axes[0].set_xlabel('Epoch')
    axes[0].set_ylabel('Loss')
    axes[0].set_title('Training and Validation Loss')
    axes[0].legend()
    axes[0].grid(True, alpha=0.3)
    
    # Accuracy curve
    axes[1].plot(history['train_accuracy'], label='Training Accuracy', marker='o')
    axes[1].plot(history['val_accuracy'], label='Validation Accuracy', marker='s')
    axes[1].set_xlabel('Epoch')
    axes[1].set_ylabel('Accuracy (%)')
    axes[1].set_title('Training and Validation Accuracy')
    axes[1].legend()
    axes[1].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('./training_curves.png', dpi=100, bbox_inches='tight')
    print("  [OK] Training curves saved to: training_curves.png")
    
    # Plot confusion matrix
    fig, ax = plt.subplots(figsize=(12, 10))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar=True,
                xticklabels=class_names, yticklabels=class_names, ax=ax)
    ax.set_xlabel('Predicted')
    ax.set_ylabel('True')
    ax.set_title('Confusion Matrix - Validation Set')
    plt.xticks(rotation=45, ha='right')
    plt.yticks(rotation=0)
    plt.tight_layout()
    plt.savefig('./confusion_matrix.png', dpi=100, bbox_inches='tight')
    print("  [OK] Confusion matrix saved to: confusion_matrix.png")
    
    print("\n" + "="*70)
    print("TRAINING COMPLETED SUCCESSFULLY")
    print("="*70 + "\n")


# ============================================================================
# ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    train()

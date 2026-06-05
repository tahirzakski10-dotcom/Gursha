import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import transforms, models
from torch.utils.data import DataLoader, Dataset
from datasets import load_dataset
from PIL import Image

# Configuration
DATASET_NAME = "ethiopian-foods" # Placeholder for Hugging Face dataset name
BATCH_SIZE = 32
EPOCHS = 20
LEARNING_RATE = 1e-4
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_SAVE_PATH = "ethiopian_food_model.pth"

class EthiopianFoodDataset(Dataset):
    def __init__(self, hf_dataset, transform=None):
        self.dataset = hf_dataset
        self.transform = transform
        
        # Create a mapping from string labels to integers based on unique labels
        unique_labels = sorted(list(set(item['text'] for item in self.dataset)))
        self.label_to_idx = {label: idx for idx, label in enumerate(unique_labels)}
        self.idx_to_label = {idx: label for label, idx in self.label_to_idx.items()}

    def __len__(self):
        return len(self.dataset)

    def __getitem__(self, idx):
        item = self.dataset[idx]
        image = item['image']
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        label = self.label_to_idx[item['text']]
        
        if self.transform:
            image = self.transform(image)
            
        return image, label

def get_transforms():
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    return train_transform, val_transform

def train():
    print(f"Using device: {DEVICE}")
    
    # Load dataset
    print("Loading dataset...")
    # NOTE: Replace 'user/ethiopian-foods' with actual HF path when running
    try:
        dataset = load_dataset('user/ethiopian-foods', split='train')
        # Simple split for demonstration: 80% train, 20% val
        dataset = dataset.train_test_split(test_size=0.2)
        train_ds = dataset['train']
        val_ds = dataset['test']
    except Exception as e:
        print(f"Failed to load dataset: {e}")
        print("Please ensure the dataset path is correct and accessible.")
        return

    train_transform, val_transform = get_transforms()
    
    train_dataset = EthiopianFoodDataset(train_ds, transform=train_transform)
    val_dataset = EthiopianFoodDataset(val_ds, transform=val_transform)
    
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4)
    
    num_classes = len(train_dataset.label_to_idx)
    print(f"Found {num_classes} classes.")
    
    # Build Model using Transfer Learning
    model = models.mobilenet_v3_large(weights=models.MobileNet_V3_Large_Weights.DEFAULT)
    # Modify classifier for our num_classes
    model.classifier[3] = nn.Linear(model.classifier[3].in_features, num_classes)
    model = model.to(DEVICE)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=LEARNING_RATE)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='max', factor=0.5, patience=3, verbose=True)
    
    best_acc = 0.0
    
    print("Starting training...")
    for epoch in range(EPOCHS):
        # Training Phase
        model.train()
        running_loss = 0.0
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * inputs.size(0)
            
        epoch_loss = running_loss / len(train_dataset)
        
        # Validation Phase
        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)
                outputs = model(inputs)
                _, preds = torch.max(outputs, 1)
                total += labels.size(0)
                correct += (preds == labels).sum().item()
                
        epoch_acc = correct / total
        print(f"Epoch {epoch+1}/{EPOCHS} - Loss: {epoch_loss:.4f} - Val Acc: {epoch_acc:.4f}")
        
        scheduler.step(epoch_acc)
        
        # Early stopping / Model saving
        if epoch_acc > best_acc:
            best_acc = epoch_acc
            torch.save(model.state_dict(), MODEL_SAVE_PATH)
            print(f"Saved best model with accuracy: {best_acc:.4f}")
            
    print("Training complete.")

if __name__ == "__main__":
    # train() # Uncomment to run training
    pass

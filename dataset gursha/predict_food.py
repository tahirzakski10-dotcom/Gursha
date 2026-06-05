"""
Ethiopian Food Recognition - Inference Script
===============================================

Inference engine for predicting Ethiopian food categories from images.

Provides:
- Single image prediction with confidence scores
- Top-K predictions
- Batch prediction capabilities
- Visualization utilities

Author: ML Engineering Team
Version: 1.0
"""

import os
import json
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import timm
from torchvision import models
from PIL import Image
import numpy as np
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')


# ============================================================================
# CONFIGURATION
# ============================================================================

class InferenceConfig:
    """Configuration for inference"""
    
    MODEL_PATH = "./model.pt"
    CLASS_NAMES_PATH = "./class_names.json"
    MODEL_NAME = "efficientnet_b0"
    IMAGE_SIZE = 224
    MEAN = [0.485, 0.456, 0.406]
    STD = [0.229, 0.224, 0.225]
    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    TOP_K = 3


# ============================================================================
# FOOD PREDICTOR CLASS
# ============================================================================

class EthiopianFoodPredictor:
    """
    Main inference class for Ethiopian food recognition.
    
    Handles model loading, image preprocessing, and prediction generation.
    """
    
    def __init__(self, model_path: str = None, class_names_path: str = None,
                 model_name: str = None, device: str = None):
        """
        Initialize the predictor.
        
        Args:
            model_path (str): Path to saved model weights
            class_names_path (str): Path to class names JSON file
            model_name (str): Model architecture name
            device (str): Device to run inference on ('cuda' or 'cpu')
        """
        
        self.model_path = model_path or InferenceConfig.MODEL_PATH
        self.class_names_path = class_names_path or InferenceConfig.CLASS_NAMES_PATH
        self.model_name = model_name or InferenceConfig.MODEL_NAME
        self.device = torch.device(device or InferenceConfig.DEVICE)
        
        # Load class names
        self._load_class_names()
        
        # Load model
        self._load_model()
        
        print(f"\n[OK] Predictor initialized successfully!")
        print(f"  Device: {self.device}")
        print(f"  Model: {self.model_name}")
        print(f"  Number of classes: {len(self.class_names)}")
    
    def _load_class_names(self):
        """Load class names from JSON file"""
        
        if not os.path.exists(self.class_names_path):
            raise FileNotFoundError(f"Class names file not found: {self.class_names_path}")
        
        with open(self.class_names_path, 'r') as f:
            self.class_names = json.load(f)
        
        self.num_classes = len(self.class_names)
        print(f"Loaded {self.num_classes} class names from {self.class_names_path}")
    
    def _load_model(self):
        """Load model architecture and weights"""
        
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found: {self.model_path}")
        
        # Build model architecture
        if self.model_name == "efficientnet_b0":
            model = timm.create_model('efficientnet_b0', pretrained=False)
            in_features = model.classifier.in_features
            model.classifier = nn.Sequential(
                nn.Dropout(0.3),
                nn.Linear(in_features, 256),
                nn.ReLU(),
                nn.Dropout(0.2),
                nn.Linear(256, self.num_classes)
            )
        
        elif self.model_name == "resnet50":
            model = models.resnet50(weights=None)
            in_features = model.fc.in_features
            model.fc = nn.Sequential(
                nn.Dropout(0.3),
                nn.Linear(in_features, 512),
                nn.ReLU(),
                nn.Dropout(0.2),
                nn.Linear(512, self.num_classes)
            )
        
        elif self.model_name == "mobilenetv3_small":
            model = models.mobilenet_v3_small(weights=None)
            in_features = model.classifier[3].in_features
            model.classifier = nn.Sequential(
                nn.Linear(in_features, 128),
                nn.Hardswish(),
                nn.Dropout(0.2),
                nn.Linear(128, self.num_classes)
            )
        
        else:
            raise ValueError(f"Unknown model: {self.model_name}")
        
        # Load weights
        model.load_state_dict(torch.load(self.model_path, map_location=self.device))
        model = model.to(self.device)
        model.eval()
        
        self.model = model
        print(f"Loaded model weights from {self.model_path}")
    
    def _get_transform(self):
        """Get image preprocessing transforms"""
        
        return transforms.Compose([
            # Resize to fixed dimensions
            transforms.Resize((InferenceConfig.IMAGE_SIZE, InferenceConfig.IMAGE_SIZE)),
            # Convert to tensor
            transforms.ToTensor(),
            # Normalize with ImageNet statistics
            transforms.Normalize(
                mean=InferenceConfig.MEAN,
                std=InferenceConfig.STD
            ),
        ])
    
    def _preprocess_image(self, image_path: str) -> torch.Tensor:
        """
        Load and preprocess an image for inference.
        
        Args:
            image_path (str): Path to image file
        
        Returns:
            torch.Tensor: Preprocessed image tensor
        """
        
        # Load image
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")
        
        image = Image.open(image_path).convert('RGB')
        
        # Apply transforms
        transform = self._get_transform()
        image_tensor = transform(image)
        
        # Add batch dimension
        image_tensor = image_tensor.unsqueeze(0)
        
        return image_tensor
    
    def predict(self, image_path: str, top_k: int = 3) -> Dict:
        """
        Predict food category for a single image.
        
        Args:
            image_path (str): Path to image file
            top_k (int): Number of top predictions to return
        
        Returns:
            dict: Prediction results containing:
                - predicted_food: Top predicted class name
                - confidence: Confidence of top prediction (0-1)
                - top_k_predictions: List of top-k predictions with scores
        """
        
        # Preprocess image
        image_tensor = self._preprocess_image(image_path)
        image_tensor = image_tensor.to(self.device)
        
        # Forward pass
        with torch.no_grad():
            outputs = self.model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            
            # Get top-k predictions
            top_probs, top_indices = torch.topk(probabilities, k=min(top_k, len(self.class_names)))
            
            # Convert to CPU and numpy
            top_probs = top_probs[0].cpu().numpy()
            top_indices = top_indices[0].cpu().numpy()
        
        # Build results
        top_k_predictions = [
            {
                "rank": i + 1,
                "food": self.class_names[idx],
                "confidence": float(prob)
            }
            for i, (idx, prob) in enumerate(zip(top_indices, top_probs))
        ]
        
        result = {
            "predicted_food": self.class_names[top_indices[0]],
            "confidence": float(top_probs[0]),
            "top_k_predictions": top_k_predictions
        }
        
        return result
    
    def batch_predict(self, image_paths: List[str], top_k: int = 3) -> List[Dict]:
        """
        Predict multiple images in batch.
        
        Args:
            image_paths (List[str]): List of image file paths
            top_k (int): Number of top predictions per image
        
        Returns:
            List[dict]: List of prediction results for each image
        """
        
        results = []
        for image_path in image_paths:
            try:
                result = self.predict(image_path, top_k=top_k)
                result['image_path'] = image_path
                results.append(result)
            except Exception as e:
                results.append({
                    'image_path': image_path,
                    'error': str(e)
                })
        
        return results
    
    def predict_from_array(self, image_array: np.ndarray, top_k: int = 3) -> Dict:
        """
        Predict from a numpy array or PIL Image.
        
        Args:
            image_array: PIL Image or numpy array
            top_k (int): Number of top predictions
        
        Returns:
            dict: Prediction results
        """
        
        # Convert numpy array to PIL Image if needed
        if isinstance(image_array, np.ndarray):
            image_array = Image.fromarray(image_array.astype('uint8'))
        
        # Ensure RGB
        if image_array.mode != 'RGB':
            image_array = image_array.convert('RGB')
        
        # Apply transforms
        transform = self._get_transform()
        image_tensor = transform(image_array).unsqueeze(0).to(self.device)
        
        # Forward pass
        with torch.no_grad():
            outputs = self.model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            
            # Get top-k predictions
            top_probs, top_indices = torch.topk(probabilities, k=min(top_k, len(self.class_names)))
            
            top_probs = top_probs[0].cpu().numpy()
            top_indices = top_indices[0].cpu().numpy()
        
        # Build results
        top_k_predictions = [
            {
                "rank": i + 1,
                "food": self.class_names[idx],
                "confidence": float(prob)
            }
            for i, (idx, prob) in enumerate(zip(top_indices, top_probs))
        ]
        
        result = {
            "predicted_food": self.class_names[top_indices[0]],
            "confidence": float(top_probs[0]),
            "top_k_predictions": top_k_predictions
        }
        
        return result


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def print_prediction(prediction: Dict, verbose: bool = True):
    """
    Pretty print prediction results.
    
    Args:
        prediction (dict): Prediction result from predict()
        verbose (bool): Print all details
    """
    
    if 'error' in prediction:
        print(f"Error: {prediction['error']}")
        return
    
    print("\n" + "="*50)
    print("PREDICTION RESULT")
    print("="*50)
    print(f"\nPredicted Food: {prediction['predicted_food']}")
    print(f"Confidence: {prediction['confidence']:.2%}")
    
    if verbose:
        print("\nTop-3 Predictions:")
        for pred in prediction['top_k_predictions']:
            print(f"  {pred['rank']}. {pred['food']}: {pred['confidence']:.2%}")
    
    print("="*50 + "\n")


# ============================================================================
# EXAMPLE USAGE
# ============================================================================

def main():
    """Example usage of the predictor"""
    
    print("\n" + "="*70)
    print("ETHIOPIAN FOOD RECOGNITION - INFERENCE")
    print("="*70)
    
    # Initialize predictor
    predictor = EthiopianFoodPredictor()
    
    # Example: Predict from image file
    # (This would be replaced with actual image path)
    # result = predictor.predict("path/to/image.jpg")
    # print_prediction(result)
    
    print("\nPredictor initialized and ready for inference!")
    print("Use predictor.predict(image_path) to make predictions")


# ============================================================================
# ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    main()

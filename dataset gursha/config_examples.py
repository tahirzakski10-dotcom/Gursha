"""
Configuration Templates and Examples
=====================================

This file contains configuration templates and example code snippets
for common use cases with the Gursha AI platform.

Copy and modify as needed for your specific use case.
"""

# ============================================================================
# TRAINING CONFIGURATION TEMPLATES
# ============================================================================

"""
TEMPLATE 1: Fast Training (for testing)
- Smaller model
- Larger batch size
- Fewer epochs
- Expected time: 30-60 minutes on GPU
"""
TRAINING_CONFIG_FAST = {
    'MODEL_NAME': 'mobilenetv3_small',
    'BATCH_SIZE': 64,
    'NUM_EPOCHS': 20,
    'LEARNING_RATE': 1e-3,
    'PATIENCE': 5,
    'IMAGE_SIZE': 192,  # Smaller images
}

"""
TEMPLATE 2: Production Training (high accuracy)
- Large model
- Medium batch size
- More epochs
- Expected time: 3-4 hours on GPU
"""
TRAINING_CONFIG_PRODUCTION = {
    'MODEL_NAME': 'efficientnet_b0',
    'BATCH_SIZE': 32,
    'NUM_EPOCHS': 100,
    'LEARNING_RATE': 1e-3,
    'PATIENCE': 15,
    'IMAGE_SIZE': 224,
}

"""
TEMPLATE 3: Maximum Accuracy (best results)
- Largest model
- Slower training
- Long training time
- Expected time: 6-8 hours on GPU
"""
TRAINING_CONFIG_MAX_ACCURACY = {
    'MODEL_NAME': 'resnet50',
    'BATCH_SIZE': 32,
    'NUM_EPOCHS': 200,
    'LEARNING_RATE': 5e-4,
    'PATIENCE': 20,
    'IMAGE_SIZE': 224,
}

"""
TEMPLATE 4: CPU Training (no GPU)
- Lightweight model
- Large batch size (to reduce training time)
- Fewer epochs
- Expected time: 24+ hours on CPU
"""
TRAINING_CONFIG_CPU = {
    'MODEL_NAME': 'mobilenetv3_small',
    'BATCH_SIZE': 128,
    'NUM_EPOCHS': 50,
    'LEARNING_RATE': 1e-3,
    'PATIENCE': 10,
    'IMAGE_SIZE': 192,
}


# ============================================================================
# INFERENCE CONFIGURATION TEMPLATES
# ============================================================================

"""
TEMPLATE 1: Standard Inference
- Load model once
- Process single images
- Get top-3 predictions
"""
def example_inference_single():
    from predict_food import EthiopianFoodPredictor
    
    # Load model
    predictor = EthiopianFoodPredictor()
    
    # Predict
    result = predictor.predict("path/to/image.jpg")
    
    # Print results
    print(f"Food: {result['predicted_food']}")
    print(f"Confidence: {result['confidence']:.2%}")
    
    for pred in result['top_k_predictions']:
        print(f"  {pred['rank']}. {pred['food']}: {pred['confidence']:.2%}")


"""
TEMPLATE 2: Batch Inference
- Process multiple images efficiently
- Get predictions for all at once
"""
def example_inference_batch():
    from predict_food import EthiopianFoodPredictor
    
    predictor = EthiopianFoodPredictor()
    
    # List of images
    image_paths = [
        "images/food1.jpg",
        "images/food2.jpg",
        "images/food3.jpg",
    ]
    
    # Batch predict
    results = predictor.batch_predict(image_paths, top_k=3)
    
    # Process results
    for result in results:
        if 'error' not in result:
            print(f"{result['image_path']}: {result['predicted_food']}")
        else:
            print(f"{result['image_path']}: ERROR")


"""
TEMPLATE 3: Numpy Array Input
- Predict from in-memory images
- Useful for image processing pipelines
"""
def example_inference_array():
    import numpy as np
    from PIL import Image
    from predict_food import EthiopianFoodPredictor
    
    predictor = EthiopianFoodPredictor()
    
    # Load image as numpy array
    image = Image.open("food.jpg")
    image_array = np.array(image)
    
    # Predict
    result = predictor.predict_from_array(image_array, top_k=3)
    
    print(f"Result: {result['predicted_food']}")


"""
TEMPLATE 4: API Client
- Make requests to running API
- Process predictions
"""
def example_api_client():
    import requests
    
    # Single prediction
    with open('food.jpg', 'rb') as f:
        files = {'file': f}
        response = requests.post(
            'http://localhost:8000/predict',
            files=files
        )
    
    result = response.json()
    print(f"API Response: {result['predicted_food']}")
    
    # Batch prediction
    files = [
        ('files', open('img1.jpg', 'rb')),
        ('files', open('img2.jpg', 'rb')),
    ]
    
    response = requests.post(
        'http://localhost:8000/predict-batch',
        files=files
    )
    
    results = response.json()['predictions']
    for pred in results:
        if 'error' not in pred:
            print(f"{pred['filename']}: {pred['predicted_food']}")


# ============================================================================
# MODEL SELECTION GUIDE
# ============================================================================

"""
Choose model based on your requirements:

┌─────────────────┬──────────┬──────────┬─────────────────┐
│ Model           │ Accuracy │ Speed    │ Best For        │
├─────────────────┼──────────┼──────────┼─────────────────┤
│ EfficientNet-B0 │ ★★★★★   │ ★★★★    │ Production      │
│ ResNet50        │ ★★★★★   │ ★★★     │ Max Accuracy    │
│ MobileNetV3     │ ★★★★    │ ★★★★★   │ Mobile/Edge     │
└─────────────────┴──────────┴──────────┴─────────────────┘

Default: EfficientNet-B0 (best balance)
"""

# ============================================================================
# DATA AUGMENTATION CUSTOMIZATION
# ============================================================================

"""
Customize augmentation pipeline in train.py:

STRONG AUGMENTATION (for small datasets):
- Increase RandomResizedCrop scale range
- Add more ColorJitter variance
- Add RandomAffine for more variations
- Good for: <5000 images

MODERATE AUGMENTATION (default):
- Balanced augmentation
- Good generalization
- Good for: 5000-50000 images

LIGHT AUGMENTATION (large datasets):
- Minimal augmentation
- Mostly just normalization
- Good for: >50000 images

See train.py:get_transforms() for examples
"""

# ============================================================================
# HYPERPARAMETER TUNING GUIDE
# ============================================================================

"""
Fine-tuning hyperparameters:

LEARNING RATE:
- Too high (1e-1): Training unstable, loss diverges
- High (1e-2): Fast convergence, may miss optimum
- Good (1e-3): Balanced convergence ✓
- Low (1e-4): Slow convergence
- Too low (1e-5): Very slow, may not converge

BATCH SIZE:
- Larger batch (128): Faster training, less noise
- Medium batch (32): Good balance ✓
- Small batch (8): Noisier gradients, better generalization

NUM_EPOCHS:
- Too few (10): Underfitting
- Good (50-100): Should converge ✓
- Many (200+): Risk of overfitting unless strong regularization

WEIGHT_DECAY:
- Prevents overfitting through L2 regularization
- Default (1e-4): Good for transfer learning
- Adjust based on overfitting severity

PATIENCE (early stopping):
- Early stop if no improvement for N epochs
- Default (15): Good balance
- Increase for longer training
"""

# ============================================================================
# TROUBLESHOOTING RECIPES
# ============================================================================

"""
PROBLEM: Model not improving (stuck at ~9% accuracy)
SOLUTIONS:
1. Learning rate too high: Reduce to 5e-4
2. Gradient overflow: Add gradient clipping (already done)
3. Data issue: Check if labels are loading correctly
4. Model mismatch: Ensure 11 output classes

PROBLEM: Training loss very high (>5.0)
SOLUTIONS:
1. Data normalization: Check ImageNet stats usage
2. Learning rate: Try 1e-2 or 1e-4
3. Model initialization: May need different seed

PROBLEM: Validation loss increasing (overfitting)
SOLUTIONS:
1. Reduce batch size (more gradient noise helps)
2. Increase dropout values (0.3 → 0.5)
3. Add more augmentation
4. Increase weight decay (1e-4 → 1e-3)
5. Use early stopping (already configured)

PROBLEM: Slow inference (>1 second per image)
SOLUTIONS:
1. Use GPU instead of CPU
2. Quantize model: torch.quantization.quantize_dynamic
3. Use MobileNetV3 instead of ResNet50
4. Reduce image size (224 → 192)

PROBLEM: High memory usage
SOLUTIONS:
1. Reduce batch size
2. Reduce image size
3. Use gradient accumulation
4. Enable mixed precision training
"""

# ============================================================================
# DEPLOYMENT RECIPES
# ============================================================================

"""
Quick Deployment Steps:

1. LOCAL TESTING:
   $ python app.py
   
2. DOCKER BUILD:
   $ docker build -t gursha-api .
   
3. DOCKER RUN:
   $ docker run -p 8000:8000 gursha-api
   
4. CLOUD DEPLOYMENT:
   - Google Cloud Run: gcloud run deploy
   - AWS Lambda: Package with serverless framework
   - Azure Container Instances: az container create
   - Heroku: git push heroku main

5. LOAD BALANCING (nginx):
   upstream gursha {
       server api1:8000;
       server api2:8000;
       server api3:8000;
   }
   
   server {
       listen 80;
       location / {
           proxy_pass http://gursha;
       }
   }

6. MONITORING:
   - Track inference latency
   - Monitor GPU memory
   - Log prediction errors
   - Set up alerts for failures
"""

# ============================================================================
# ADVANCED USAGE
# ============================================================================

"""
ENSEMBLE PREDICTIONS:
- Train multiple models
- Average predictions
- Better accuracy (1-3% improvement)

CODE:
predictors = [
    EthiopianFoodPredictor("model_1.pt"),
    EthiopianFoodPredictor("model_2.pt"),
    EthiopianFoodPredictor("model_3.pt"),
]

image = Image.open("food.jpg")
predictions = [p.predict_from_array(image) for p in predictors]

# Average confidences
avg_confidence = np.mean([p['confidence'] for p in predictions])

KNOWLEDGE DISTILLATION:
- Train large teacher model
- Distill to smaller student model
- Fast inference with good accuracy

MODEL QUANTIZATION:
- Convert to int8
- 4x smaller, 2x faster
- Minimal accuracy loss

Code: See torch.quantization documentation
"""

# ============================================================================
# MONITORING METRICS
# ============================================================================

"""
Key metrics to track:

TRAINING:
- Loss convergence
- Accuracy improvement
- Per-class accuracy
- Gradient norms

INFERENCE:
- Latency (ms per image)
- Throughput (images/second)
- Memory usage (MB)
- GPU utilization (%)

PRODUCTION:
- Error rate
- Prediction distribution
- Confidence calibration
- User satisfaction

Log these with tools like:
- Wandb: wandb.log()
- TensorBoard: writer.add_scalar()
- MLflow: mlflow.log_metric()
"""


if __name__ == "__main__":
    print("Configuration Templates - See examples above")
    print("\nExample functions:")
    print("- example_inference_single()")
    print("- example_inference_batch()")
    print("- example_inference_array()")
    print("- example_api_client()")

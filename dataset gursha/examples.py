"""
Example Usage Demonstrations
============================

This file contains practical examples for using the Gursha platform.
Copy and modify these examples for your own use cases.

Examples included:
1. Single image prediction
2. Batch predictions
3. API client usage
4. Custom training configuration
5. Inference performance testing
"""

import os
import time
import json
from pathlib import Path


# ============================================================================
# Example 1: Single Image Prediction
# ============================================================================

def example_single_prediction():
    """
    Example: Predict a single food image
    
    This is the most basic usage - load a predictor and make one prediction.
    """
    
    print("\n" + "="*70)
    print("EXAMPLE 1: Single Image Prediction")
    print("="*70)
    
    from predict_food import EthiopianFoodPredictor, print_prediction
    
    # Initialize predictor (loads model once)
    print("\n1. Initializing predictor...")
    predictor = EthiopianFoodPredictor()
    
    # In real usage, replace with actual image path
    # For now, we'll demonstrate the output format
    print("\n2. Ready to make predictions!")
    print("   Usage: result = predictor.predict('path/to/food_image.jpg')")
    
    print("\n3. Expected output format:")
    example_result = {
        "predicted_food": "Doro Wat",
        "confidence": 0.9234,
        "top_k_predictions": [
            {"rank": 1, "food": "Doro Wat", "confidence": 0.9234},
            {"rank": 2, "food": "Shiro Wat", "confidence": 0.0512},
            {"rank": 3, "food": "Beyaynetu", "confidence": 0.0254}
        ]
    }
    
    print("\n   Result:")
    print(f"   - Food: {example_result['predicted_food']}")
    print(f"   - Confidence: {example_result['confidence']:.2%}")
    print(f"   - Top-3 alternatives: {len(example_result['top_k_predictions'])} items")
    
    print("\n✓ Example completed!")


# ============================================================================
# Example 2: Batch Prediction
# ============================================================================

def example_batch_prediction():
    """
    Example: Predict multiple images efficiently
    
    Useful when processing directories or datasets.
    """
    
    print("\n" + "="*70)
    print("EXAMPLE 2: Batch Prediction")
    print("="*70)
    
    from predict_food import EthiopianFoodPredictor
    
    # Initialize predictor
    print("\n1. Initializing predictor...")
    predictor = EthiopianFoodPredictor()
    
    # Create example image paths (you would use real paths)
    image_paths = [
        "images/doro_wat.jpg",
        "images/kitfo.jpg",
        "images/shiro_wat.jpg",
    ]
    
    print(f"\n2. Processing {len(image_paths)} images...")
    print("   Usage: results = predictor.batch_predict(image_paths)")
    
    # Demonstrate processing
    print("\n3. Example results:")
    example_results = [
        {
            "image_path": "images/doro_wat.jpg",
            "predicted_food": "Doro Wat",
            "confidence": 0.92
        },
        {
            "image_path": "images/kitfo.jpg",
            "predicted_food": "Kitfo",
            "confidence": 0.88
        },
        {
            "image_path": "images/shiro_wat.jpg",
            "predicted_food": "Shiro Wat",
            "confidence": 0.91
        },
    ]
    
    for result in example_results:
        print(f"\n   {result['image_path']}")
        print(f"   → {result['predicted_food']} ({result['confidence']:.0%})")
    
    print("\n✓ Batch processing example completed!")


# ============================================================================
# Example 3: API Client Usage
# ============================================================================

def example_api_usage():
    """
    Example: Use the REST API to make predictions
    
    Useful when running a separate API server.
    """
    
    print("\n" + "="*70)
    print("EXAMPLE 3: API Client Usage")
    print("="*70)
    
    print("""
1. Start API server in terminal:
   $ python app.py

2. In another terminal/script, use the API:

   import requests
   
   # Single prediction
   with open('food.jpg', 'rb') as f:
       files = {'file': f}
       response = requests.post(
           'http://localhost:8000/predict',
           files=files
       )
   
   result = response.json()
   print(f"Prediction: {result['predicted_food']}")
   print(f"Confidence: {result['confidence']:.2%}")

3. API Endpoints:

   Health Check:
   $ curl http://localhost:8000/health
   
   Model Info:
   $ curl http://localhost:8000/info
   
   Batch Prediction:
   $ curl -X POST http://localhost:8000/predict-batch \\
       -F "files=@img1.jpg" \\
       -F "files=@img2.jpg"

4. Interactive Documentation:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc
    """)
    
    print("✓ API usage example shown!")


# ============================================================================
# Example 4: Custom Training Configuration
# ============================================================================

def example_custom_training():
    """
    Example: Train model with custom configuration
    
    Shows how to modify training parameters.
    """
    
    print("\n" + "="*70)
    print("EXAMPLE 4: Custom Training Configuration")
    print("="*70)
    
    print("""
1. Edit train.py Config class:

   class Config:
       # Model selection
       MODEL_NAME = "efficientnet_b0"  # or resnet50, mobilenetv3_small
       
       # Training parameters
       BATCH_SIZE = 32           # Increase for speed, decrease for memory
       NUM_EPOCHS = 100          # More epochs = longer training
       LEARNING_RATE = 1e-3      # Adjust if not converging
       PATIENCE = 15             # Early stopping patience
       
       # Device
       DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

2. Common configurations:

   # FAST TRAINING (testing)
   BATCH_SIZE = 64
   NUM_EPOCHS = 20
   MODEL_NAME = "mobilenetv3_small"
   
   # PRODUCTION (balanced)
   BATCH_SIZE = 32
   NUM_EPOCHS = 100
   MODEL_NAME = "efficientnet_b0"
   
   # MAX ACCURACY (best results)
   BATCH_SIZE = 32
   NUM_EPOCHS = 200
   MODEL_NAME = "resnet50"
   LEARNING_RATE = 5e-4

3. Train with custom config:
   $ python train.py

4. Monitor training:
   - Watch console output
   - Check loss convergence
   - Validation accuracy trend
   - Training curves (generated after)

5. Generated outputs:
   - model.pt (trained weights)
   - class_names.json (labels)
   - training_curves.png (loss/accuracy)
   - confusion_matrix.png (per-class performance)
   - training_history.json (detailed metrics)
    """)
    
    print("✓ Training configuration example shown!")


# ============================================================================
# Example 5: Performance Testing
# ============================================================================

def example_performance_testing():
    """
    Example: Benchmark model inference performance
    
    Useful for optimization and production planning.
    """
    
    print("\n" + "="*70)
    print("EXAMPLE 5: Performance Testing")
    print("="*70)
    
    print("""
Performance benchmarking code:

    import time
    import numpy as np
    from predict_food import EthiopianFoodPredictor
    
    predictor = EthiopianFoodPredictor()
    
    # Single image performance
    image_path = "test_image.jpg"
    
    num_iterations = 10
    times = []
    
    print("Warming up GPU...")
    predictor.predict(image_path)
    
    print("\\nBenchmarking inference performance...")
    for i in range(num_iterations):
        start = time.time()
        result = predictor.predict(image_path)
        elapsed = time.time() - start
        times.append(elapsed)
    
    # Statistics
    times = np.array(times)
    
    print(f"\\nPerformance Statistics ({num_iterations} iterations):")
    print(f"  Min latency:    {times.min() * 1000:.2f} ms")
    print(f"  Max latency:    {times.max() * 1000:.2f} ms")
    print(f"  Mean latency:   {times.mean() * 1000:.2f} ms")
    print(f"  Median latency: {np.median(times) * 1000:.2f} ms")
    print(f"  Std deviation:  {times.std() * 1000:.2f} ms")
    
    # Throughput
    throughput = 1 / times.mean()
    print(f"\\nThroughput: {throughput:.1f} images/second")

Expected results:
    - GPU (NVIDIA RTX 3080): ~50-100 images/second
    - GPU (NVIDIA A100): ~200-300 images/second
    - CPU (Intel i7): ~5-10 images/second
    """)
    
    print("✓ Performance testing example shown!")


# ============================================================================
# Example 6: Error Handling
# ============================================================================

def example_error_handling():
    """
    Example: Proper error handling in production code
    """
    
    print("\n" + "="*70)
    print("EXAMPLE 6: Error Handling")
    print("="*70)
    
    print("""
Robust error handling example:

    from predict_food import EthiopianFoodPredictor
    import os
    
    def safe_predict(image_path, predictor=None):
        '''
        Safely make a prediction with error handling
        '''
        
        try:
            # Initialize predictor if needed
            if predictor is None:
                predictor = EthiopianFoodPredictor()
            
            # Check if file exists
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image not found: {image_path}")
            
            # Make prediction
            result = predictor.predict(image_path)
            
            # Validate result
            if result['confidence'] < 0.3:
                print(f"WARNING: Low confidence prediction ({result['confidence']:.2%})")
            
            return result
        
        except FileNotFoundError as e:
            print(f"ERROR: {e}")
            return None
        
        except Exception as e:
            print(f"ERROR: Unexpected error during prediction: {e}")
            return None
    
    # Usage
    result = safe_predict("food.jpg")
    if result:
        print(f"Prediction: {result['predicted_food']}")
    else:
        print("Prediction failed")
    """)
    
    print("✓ Error handling example shown!")


# ============================================================================
# Example 7: Batch Processing from Directory
# ============================================================================

def example_directory_processing():
    """
    Example: Process all images in a directory
    """
    
    print("\n" + "="*70)
    print("EXAMPLE 7: Directory Processing")
    print("="*70)
    
    print("""
Process all images in a directory:

    import os
    from pathlib import Path
    from predict_food import EthiopianFoodPredictor
    
    predictor = EthiopianFoodPredictor()
    
    image_dir = "food_images/"
    results = []
    
    # Get all image files
    image_extensions = {'.jpg', '.jpeg', '.png', '.JPG', '.PNG'}
    image_files = [
        f for f in os.listdir(image_dir)
        if Path(f).suffix in image_extensions
    ]
    
    print(f"Found {len(image_files)} images")
    
    # Process each image
    for filename in image_files:
        image_path = os.path.join(image_dir, filename)
        
        try:
            result = predictor.predict(image_path)
            result['filename'] = filename
            results.append(result)
            
            print(f"{filename}: {result['predicted_food']} ({result['confidence']:.2%})")
        
        except Exception as e:
            print(f"{filename}: ERROR - {e}")
    
    # Summary statistics
    print(f"\\nProcessed {len(results)} images successfully")
    
    # Average confidence
    confidences = [r['confidence'] for r in results]
    avg_confidence = sum(confidences) / len(confidences)
    print(f"Average confidence: {avg_confidence:.2%}")
    
    # Save results
    with open('predictions.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("Results saved to predictions.json")
    """)
    
    print("✓ Directory processing example shown!")


# ============================================================================
# Main Menu
# ============================================================================

def main():
    """
    Display menu of available examples
    """
    
    print("\n")
    print("╔" + "="*68 + "╗")
    print("║" + " "*20 + "GURSHA - Usage Examples" + " "*26 + "║")
    print("╚" + "="*68 + "╝")
    
    examples = [
        ("1", "Single Image Prediction", example_single_prediction),
        ("2", "Batch Prediction", example_batch_prediction),
        ("3", "API Client Usage", example_api_usage),
        ("4", "Custom Training Config", example_custom_training),
        ("5", "Performance Testing", example_performance_testing),
        ("6", "Error Handling", example_error_handling),
        ("7", "Directory Processing", example_directory_processing),
        ("8", "Run All Examples", None),
    ]
    
    print("\nAvailable Examples:\n")
    for num, description, _ in examples:
        print(f"  {num}. {description}")
    
    print("\n" + "-"*70)
    
    # For script execution, run all examples
    print("\nRunning all examples...\n")
    
    for num, description, func in examples[:-1]:  # Skip "Run All"
        if func:
            try:
                func()
            except Exception as e:
                print(f"\n⚠️  Error in {description}: {e}")
    
    print("\n" + "="*70)
    print("All examples completed!")
    print("="*70)
    print("""
Next steps:
1. Modify examples for your use case
2. Train model: python train.py
3. Test predictions: python predict_food.py
4. Run API: python app.py
5. See README.md for complete documentation
    """)


if __name__ == "__main__":
    main()

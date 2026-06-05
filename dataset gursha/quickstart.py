#!/usr/bin/env python
"""
Quick Start Script for Gursha AI Platform
==========================================

This script provides a quick setup and testing guide.
Run this to verify installation and get started quickly.

Usage:
    python quickstart.py
"""

import os
import sys
import torch
import json


def print_header(text):
    """Print formatted header"""
    print("\n" + "="*70)
    print(f"  {text}")
    print("="*70)


def check_environment():
    """Check and display environment setup"""
    
    print_header("ENVIRONMENT CHECK")
    
    # Python version
    print(f"\n✓ Python Version: {sys.version.split()[0]}")
    
    # PyTorch
    print(f"✓ PyTorch Version: {torch.__version__}")
    
    # GPU Check
    if torch.cuda.is_available():
        print(f"✓ GPU Available: YES")
        print(f"  Device Name: {torch.cuda.get_device_name(0)}")
        print(f"  Device Count: {torch.cuda.device_count()}")
        
        # Memory
        if hasattr(torch.cuda, 'get_device_properties'):
            props = torch.cuda.get_device_properties(0)
            memory_gb = props.total_memory / 1e9
            print(f"  Total Memory: {memory_gb:.2f} GB")
    else:
        print(f"✓ GPU Available: NO (CPU mode will be used)")
    
    # Check installed packages
    print("\n✓ Checking dependencies...")
    
    packages = {
        'torch': 'PyTorch',
        'torchvision': 'TorchVision',
        'timm': 'Timm',
        'datasets': 'Hugging Face Datasets',
        'fastapi': 'FastAPI',
        'PIL': 'Pillow',
        'sklearn': 'Scikit-learn',
    }
    
    missing = []
    for pkg, name in packages.items():
        try:
            __import__(pkg)
            print(f"  ✓ {name}")
        except ImportError:
            print(f"  ✗ {name} (MISSING)")
            missing.append(name)
    
    if missing:
        print(f"\n⚠️  Missing packages: {', '.join(missing)}")
        print("Install with: pip install -r requirements.txt")
        return False
    
    return True


def check_model_files():
    """Check if model files exist"""
    
    print_header("MODEL FILES CHECK")
    
    files = {
        'model.pt': 'Trained Model Weights',
        'class_names.json': 'Class Names Mapping',
    }
    
    all_exist = True
    
    for filename, description in files.items():
        if os.path.exists(filename):
            size_mb = os.path.getsize(filename) / 1e6
            print(f"✓ {description}: {filename} ({size_mb:.2f} MB)")
        else:
            print(f"✗ {description}: {filename} (NOT FOUND)")
            all_exist = False
    
    if not all_exist:
        print("\n⚠️  Model files not found!")
        print("Train a model with: python train.py")
    
    return all_exist


def check_files():
    """Check if all project files exist"""
    
    print_header("PROJECT FILES CHECK")
    
    files = {
        'train.py': 'Training Script',
        'predict_food.py': 'Inference Engine',
        'app.py': 'FastAPI Application',
        'requirements.txt': 'Dependencies',
        'README.md': 'Documentation',
    }
    
    all_exist = True
    
    for filename, description in files.items():
        if os.path.exists(filename):
            size_kb = os.path.getsize(filename) / 1e3
            print(f"✓ {description}: {filename} ({size_kb:.1f} KB)")
        else:
            print(f"✗ {description}: {filename} (NOT FOUND)")
            all_exist = False
    
    return all_exist


def show_quick_commands():
    """Show quick start commands"""
    
    print_header("QUICK START COMMANDS")
    
    commands = {
        "Train Model": "python train.py",
        "Run Inference": "python predict_food.py",
        "Start API": "python app.py",
        "API (with reload)": "uvicorn app:app --reload",
        "View Docs": "# Open browser: http://localhost:8000/docs",
    }
    
    print("\nAvailable commands:\n")
    
    for description, command in commands.items():
        print(f"  {description}:")
        print(f"    $ {command}\n")


def show_usage_examples():
    """Show usage examples"""
    
    print_header("USAGE EXAMPLES")
    
    print("\n1. Train a Model:")
    print("""
    python train.py
    
    This will:
    - Load dataset from Hugging Face
    - Create train/validation split
    - Train EfficientNet-B0 model
    - Save model.pt and class_names.json
    - Generate training plots and metrics
    """)
    
    print("\n2. Make Predictions:")
    print("""
    from predict_food import EthiopianFoodPredictor
    
    predictor = EthiopianFoodPredictor()
    result = predictor.predict("food_image.jpg")
    
    print(result['predicted_food'])
    print(result['confidence'])
    """)
    
    print("\n3. Start REST API:")
    print("""
    python app.py
    
    Then in another terminal:
    curl -X POST http://localhost:8000/predict \\
        -F "file=@food_image.jpg"
    """)


def test_inference():
    """Test if inference works"""
    
    print_header("INFERENCE TEST")
    
    if not os.path.exists('model.pt'):
        print("\n⚠️  model.pt not found - skip inference test")
        print("Train a model first with: python train.py")
        return False
    
    try:
        print("\nLoading model...")
        from predict_food import EthiopianFoodPredictor
        
        predictor = EthiopianFoodPredictor()
        print("✓ Model loaded successfully!")
        
        print(f"\nModel Info:")
        print(f"  Architecture: {predictor.model_name}")
        print(f"  Classes: {predictor.num_classes}")
        print(f"  Device: {predictor.device}")
        print(f"  Classes: {', '.join(predictor.class_names[:3])}...")
        
        return True
    
    except Exception as e:
        print(f"\n✗ Error loading model: {str(e)}")
        return False


def show_next_steps():
    """Show recommended next steps"""
    
    print_header("NEXT STEPS")
    
    print("""
1. TRAIN THE MODEL:
   $ python train.py
   
   This will download the dataset and train the model.
   Takes 2-4 hours on GPU, 12-24 hours on CPU.

2. TEST INFERENCE:
   $ python predict_food.py
   
   Update the main() function with your image path.

3. RUN THE API:
   $ python app.py
   
   API will be available at http://localhost:8000
   Swagger UI at http://localhost:8000/docs

4. EXPLORE RESULTS:
   - training_curves.png: Loss and accuracy plots
   - confusion_matrix.png: Per-class performance
   - training_history.json: Detailed metrics

5. CUSTOMIZE:
   Edit Config class in train.py to:
   - Change model (EfficientNet-B0, ResNet50, MobileNetV3)
   - Adjust hyperparameters
   - Modify augmentation pipeline

6. DEPLOY:
   - Docker: See README.md for Dockerfile
   - Cloud: Deploy Docker image to cloud platform
   - Production: Use Model Quantization for speed
    """)


def main():
    """Main quickstart flow"""
    
    print("\n")
    print("╔" + "="*68 + "╗")
    print("║" + " "*15 + "GURSHA - Ethiopian Food Recognition" + " "*19 + "║")
    print("║" + " "*25 + "Quick Start Guide" + " "*27 + "║")
    print("╚" + "="*68 + "╝")
    
    # Check environment
    if not check_environment():
        print("\n⚠️  Some dependencies are missing!")
        print("Run: pip install -r requirements.txt")
        return
    
    # Check files
    check_files()
    
    # Check model files
    model_exists = check_model_files()
    
    # Test inference
    if model_exists:
        test_inference()
    
    # Show commands
    show_quick_commands()
    
    # Show examples
    show_usage_examples()
    
    # Show next steps
    show_next_steps()
    
    print_header("READY TO START!")
    print("""
Choose your next action:

  1. Train model:      python train.py
  2. Test inference:   python -c "from predict_food import EthiopianFoodPredictor; print(EthiopianFoodPredictor())"
  3. Start API:        python app.py
  4. Read docs:        cat README.md

For more information, see README.md
    """)


if __name__ == "__main__":
    main()

# Ethiopian Food Recognition AI Platform - Gursha

A production-ready AI nutrition platform for identifying Ethiopian food dishes from images using advanced transfer learning and computer vision techniques.

## 📋 Table of Contents

- [Overview](#overview)
- [Dataset](#dataset)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Model Architecture](#model-architecture)
- [Training](#training)
- [Inference](#inference)
- [API](#api)
- [Performance Metrics](#performance-metrics)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Gursha is an AI-powered platform that recognizes 11 different Ethiopian food categories using deep learning. The system leverages transfer learning with state-of-the-art pre-trained models to achieve high accuracy on a relatively small dataset (1,097 images).

**Supported Ethiopian Foods:**
- Beyaynetu (በያይነቱ)
- Chechebsa (ጨጨብሳ)
- Doro Wat (ዶሮ ወጥ)
- Fir-fir (ፍርፍር)
- Genfo (ገንፎ)
- Kikil (ቅቅል)
- Kitfo (ክትፎ)
- Shekla Tibs (ሸክላ ጥብስ)
- Shiro Wat (ሽሮ ወጥ)
- Tihlo (ጥህሎ)
- Tire Siga (ጥሬ ስጋ)

## 📊 Dataset

- **Source:** Hugging Face Dataset (`zakir22/Ethiopian-foods`)
- **Size:** 1,097 images
- **Classes:** 11 Ethiopian food categories
- **Format:** Images (JPEG/PNG) with text labels
- **Collection:** Sourced from social media

## ✨ Features

### Model Training
- ✅ **Transfer Learning:** EfficientNet-B0, ResNet50, MobileNetV3 support
- ✅ **Advanced Data Augmentation:** Random crops, rotations, color jittering
- ✅ **Optimization:** AdamW optimizer with learning rate scheduling
- ✅ **Early Stopping:** Prevent overfitting with automatic checkpointing
- ✅ **GPU Support:** Automatic CUDA detection and optimization

### Metrics & Monitoring
- ✅ **Training Curves:** Loss and accuracy visualization
- ✅ **Confusion Matrix:** Per-class performance analysis
- ✅ **Per-Class Accuracy:** Individual class metrics
- ✅ **Model Checkpointing:** Automatic best model saving

### Inference
- ✅ **Single Image Prediction:** Get top-3 predictions with confidence scores
- ✅ **Batch Processing:** Process multiple images efficiently
- ✅ **Multiple Input Formats:** Image files, numpy arrays, PIL images

### API & Deployment
- ✅ **FastAPI REST API:** Production-ready endpoints
- ✅ **CORS Support:** Cross-origin requests enabled
- ✅ **Health Checks:** API monitoring endpoints
- ✅ **Batch Processing:** Multi-image predictions
- ✅ **Error Handling:** Comprehensive error responses

## 📁 Project Structure

```
dataset gursha/
├── train.py                 # Training script (1000+ lines, fully commented)
├── predict_food.py         # Inference engine (400+ lines, fully commented)
├── app.py                  # FastAPI application (500+ lines, fully commented)
├── requirements.txt        # Python dependencies
├── README.md               # Documentation
├── model.pt               # Trained model weights (generated)
├── class_names.json       # Class labels mapping (generated)
├── training_history.json  # Training metrics (generated)
├── training_curves.png    # Loss/accuracy plots (generated)
├── confusion_matrix.png   # Performance matrix (generated)
└── checkpoints/           # Model checkpoints directory (generated)
    └── best_model.pt
```

## 🔧 Installation

### Prerequisites

- Python 3.8+
- CUDA 11.8+ (optional, for GPU acceleration)
- pip or conda

### Step 1: Navigate to Project Directory

```bash
cd "dataset gursha"
```

### Step 2: Create Virtual Environment

**Using venv:**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

**Using conda:**
```bash
conda create -n gursha python=3.10
conda activate gursha
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Verify Installation

```bash
# Check PyTorch and GPU
python -c "import torch; print(f'PyTorch: {torch.__version__}'); print(f'GPU: {torch.cuda.is_available()}')"

# Check other dependencies
python -c "import datasets; import timm; print('All dependencies installed!')"
```

## 📚 Usage

### Training the Model

#### Basic Training

```bash
python train.py
```

The script will:
1. Load the Ethiopian-foods dataset from Hugging Face
2. Create train/validation split (80/20)
3. Build transfer learning model
4. Train with early stopping and checkpointing
5. Generate metrics and visualizations
6. Save `model.pt` and `class_names.json`

#### Custom Configuration

Edit configuration in `train.py`:

```python
class Config:
    # Model selection
    MODEL_NAME = "efficientnet_b0"  # or "resnet50", "mobilenetv3_small"
    
    # Training parameters
    BATCH_SIZE = 32
    NUM_EPOCHS = 100
    LEARNING_RATE = 1e-3
    PATIENCE = 15
    
    # Device selection
    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
```

#### Training Output

Generated files:

| File | Description |
|------|-------------|
| `model.pt` | Trained model weights (recommended: keep as checkpoint) |
| `class_names.json` | JSON mapping of class indices to food names |
| `training_history.json` | Metrics over epochs (loss, accuracy, learning rate) |
| `training_curves.png` | Loss and accuracy plots |
| `confusion_matrix.png` | Per-class prediction performance heatmap |
| `checkpoints/best_model.pt` | Best model from training |

### Inference

#### Single Image Prediction

```python
from predict_food import EthiopianFoodPredictor

# Initialize predictor (loads model once)
predictor = EthiopianFoodPredictor()

# Predict from image file
result = predictor.predict("path/to/food_image.jpg")

print(f"Predicted Food: {result['predicted_food']}")
print(f"Confidence: {result['confidence']:.2%}")

# Top-3 predictions
print("\nTop-3 Predictions:")
for pred in result['top_k_predictions']:
    print(f"  {pred['rank']}. {pred['food']}: {pred['confidence']:.2%}")
```

Output example:
```
Predicted Food: Doro Wat
Confidence: 92.34%

Top-3 Predictions:
  1. Doro Wat: 92.34%
  2. Shiro Wat: 5.12%
  3. Beyaynetu: 2.54%
```

#### Batch Prediction

```python
# Process multiple images at once
image_paths = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg"]
results = predictor.batch_predict(image_paths, top_k=3)

for result in results:
    if 'error' not in result:
        print(f"{result['image_path']}: {result['predicted_food']} ({result['confidence']:.2%})")
    else:
        print(f"{result['image_path']}: ERROR - {result['error']}")
```

#### Numpy Array / PIL Image Input

```python
import numpy as np
from PIL import Image

# From PIL Image
pil_image = Image.open("food.jpg")
result = predictor.predict_from_array(pil_image)

# From numpy array
image_array = np.array(Image.open("food.jpg"))
result = predictor.predict_from_array(image_array)

print(f"Result: {result['predicted_food']}")
```

### REST API

#### Start API Server

```bash
# Using app.py directly
python app.py

# Or with Uvicorn
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Server will start at: `http://localhost:8000`

#### Interactive API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

#### API Endpoints

**1. Health Check**

Check if API is running:

```bash
curl http://localhost:8000/health
```

Response:
```json
{
    "status": "healthy",
    "timestamp": "2026-06-05T10:30:00.123456",
    "gpu_available": true,
    "device": "cuda"
}
```

**2. Model Information**

Get details about the loaded model:

```bash
curl http://localhost:8000/info
```

Response:
```json
{
    "model_name": "efficientnet_b0",
    "num_classes": 11,
    "class_names": ["Beyaynetu", "Chechebsa", "Doro Wat", ...],
    "input_size": 224,
    "device": "cuda"
}
```

**3. Single Prediction (Main Endpoint)**

Upload an image and get prediction:

```bash
curl -X POST http://localhost:8000/predict \
    -H "Content-Type: multipart/form-data" \
    -F "file=@path/to/food_image.jpg"
```

Response:
```json
{
    "predicted_food": "Doro Wat",
    "confidence": 0.9234,
    "top_k_predictions": [
        {
            "rank": 1,
            "food": "Doro Wat",
            "confidence": 0.9234
        },
        {
            "rank": 2,
            "food": "Shiro Wat",
            "confidence": 0.0512
        },
        {
            "rank": 3,
            "food": "Beyaynetu",
            "confidence": 0.0254
        }
    ]
}
```

**4. Batch Prediction**

Upload multiple images:

```bash
curl -X POST http://localhost:8000/predict-batch \
    -F "files=@img1.jpg" \
    -F "files=@img2.jpg" \
    -F "files=@img3.jpg"
```

Response:
```json
{
    "predictions": [
        {
            "filename": "img1.jpg",
            "predicted_food": "Doro Wat",
            "confidence": 0.92,
            ...
        },
        {
            "filename": "img2.jpg",
            "predicted_food": "Kitfo",
            "confidence": 0.88,
            ...
        }
    ]
}
```

#### Python Client Example

```python
import requests

# Single prediction
files = {'file': open('food.jpg', 'rb')}
response = requests.post('http://localhost:8000/predict', files=files)
result = response.json()

print(f"Prediction: {result['predicted_food']}")
print(f"Confidence: {result['confidence']:.2%}")

# Batch prediction
files = [
    ('files', open('img1.jpg', 'rb')),
    ('files', open('img2.jpg', 'rb')),
    ('files', open('img3.jpg', 'rb'))
]
response = requests.post('http://localhost:8000/predict-batch', files=files)
results = response.json()['predictions']

for pred in results:
    print(f"{pred['filename']}: {pred['predicted_food']}")
```

## 🧠 Model Architecture

### Transfer Learning Strategy

The platform uses multi-tier transfer learning for maximum accuracy on limited data:

#### Model Comparisons

| Model | Params | Accuracy | Speed | Best For |
|-------|--------|----------|-------|----------|
| **EfficientNet-B0** | 5.3M | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Production (Recommended) |
| **ResNet50** | 23.5M | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Maximum Accuracy |
| **MobileNetV3** | 2.5M | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Mobile/Edge |

#### Classification Head Architecture

All models use a dropout-regularized head:

```
Input Features
    ↓
Dropout(0.3)
    ↓
Linear(in_features → hidden)
    ↓
ReLU Activation
    ↓
Dropout(0.2)
    ↓
Linear(hidden → 11 classes)
    ↓
Output Logits
```

This design prevents overfitting on the small dataset (1,097 images).

## 🎓 Training Details

### Data Augmentation Pipeline

**Strong augmentation strategy** optimized for small datasets:

```python
Transforms:
├── RandomResizedCrop(224, scale=0.8-1.0, ratio=0.75-1.33)
│   └── Crops 80-100% of image, varies aspect ratio
├── RandomHorizontalFlip(p=0.5)
│   └── Mirror horizontal (common for food)
├── RandomRotation(degrees=±15)
│   └── Slight rotations for viewing angle variance
├── ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1)
│   └── Simulates different lighting conditions
├── GaussianBlur(sigma=0.1-2.0)
│   └── Robustness to image sharpness
├── RandomVerticalFlip(p=0.1)
│   └── Occasional vertical flips
└── Normalize(ImageNet stats)
    └── ImageNet pre-training normalization
```

### Optimization Configuration

| Parameter | Value | Reasoning |
|-----------|-------|-----------|
| Optimizer | AdamW | Adaptive learning, weight decay |
| Learning Rate | 1e-3 | Good for fine-tuning |
| Weight Decay | 1e-4 | L2 regularization |
| Batch Size | 32 | Balance speed and stability |
| LR Scheduler | ReduceLROnPlateau | Reduce LR if loss plateaus |
| Early Stopping | 15 epochs | Prevent overfitting |

### Training Process

1. **Warm-up (Epochs 1-5):** Full model trains with regularization
2. **Main Training (Epochs 6-100):** Full training with LR scheduling
3. **Monitoring:** Validation every epoch, best model checkpointed
4. **Termination:** Early stop after 15 epochs without improvement

### Tracked Metrics

During training, the script logs:

```
Epoch [1/100]
  Train Loss: 2.4321 | Train Acc: 12.50%
  Val Loss:   2.5234 | Val Acc:   10.20%
  Learning Rate: 1.00e-03
  ✓ Best model saved (Val Loss: 2.5234)
```

After training completion:

```
Per-Class Accuracy:
  Beyaynetu: 88.50%
  Chechebsa: 92.30%
  Doro Wat:  94.20%
  ... (11 classes total)
```

## 📊 Performance Metrics

### Expected Results

On the Ethiopian-foods dataset with EfficientNet-B0:

| Metric | Expected | Hardware |
|--------|----------|----------|
| **Validation Accuracy** | 85-92% | GPU |
| **Per-Class F1 Score** | 0.80-0.95 | GPU |
| **Training Time** | 2-4 hours | NVIDIA GPU |
| **Inference Time** | ~20ms | NVIDIA GPU |
| **Training Time** | 12-24 hours | CPU |
| **Inference Time** | ~200ms | CPU |

### Generated Outputs

**training_curves.png:**
- Loss convergence plot (training vs validation)
- Accuracy improvement over epochs
- Helps identify overfitting/underfitting

**confusion_matrix.png:**
- 11×11 heatmap of predictions
- Identifies which classes are confused
- Guides data collection for weak classes

**training_history.json:**
```json
{
    "train_loss": [2.4, 1.8, 1.2, 0.8, 0.5, ...],
    "val_loss": [2.5, 1.9, 1.3, 0.9, 0.6, ...],
    "train_accuracy": [12.5, 35.2, 65.1, 82.3, 88.5, ...],
    "val_accuracy": [10.2, 32.1, 62.5, 79.8, 85.2, ...],
    "learning_rate": [0.001, 0.001, 0.0005, 0.0005, ...]
}
```

## 🚀 Deployment

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libsm6 libxext6 libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY train.py predict_food.py app.py ./
COPY model.pt class_names.json ./

EXPOSE 8000

CMD ["python", "app.py"]
```

Build and run:

```bash
# Build image
docker build -t gursha-api:latest .

# Run container
docker run -p 8000:8000 \
    --gpus all \
    gursha-api:latest

# Run with environment variables
docker run -p 8000:8000 \
    --gpus all \
    -e MODEL_PATH=./model.pt \
    -e CLASS_NAMES_PATH=./class_names.json \
    gursha-api:latest
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - MODEL_PATH=./model.pt
      - CLASS_NAMES_PATH=./class_names.json
    volumes:
      - ./model.pt:/app/model.pt
      - ./class_names.json:/app/class_names.json
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```

Run:

```bash
docker-compose up
```

### Production Optimization

**1. Model Quantization (Faster Inference):**

```python
import torch

# Load model
model = load_model()

# Convert to TorchScript
scripted_model = torch.jit.script(model)
scripted_model.save("model_optimized.pt")

# Use in inference
optimized_model = torch.jit.load("model_optimized.pt")
```

**2. Mixed Precision (GPU Memory):**

```python
from torch.cuda.amp import autocast

# In inference
with autocast():
    output = model(input_image)
```

**3. ONNX Export (Cross-Platform):**

```python
import torch
import torch.onnx

dummy_input = torch.randn(1, 3, 224, 224)
torch.onnx.export(
    model,
    dummy_input,
    "model.onnx",
    input_names=['input'],
    output_names=['output']
)
```

**4. Load Balancing:**

Use Nginx to balance requests across multiple API instances:

```nginx
upstream gursha_api {
    server api1:8000;
    server api2:8000;
    server api3:8000;
}

server {
    listen 80;
    location /predict {
        proxy_pass http://gursha_api;
    }
}
```

## 🔧 Troubleshooting

### GPU Not Detected

**Check GPU availability:**

```bash
python -c "import torch; print(torch.cuda.is_available())"
python -c "import torch; print(torch.cuda.device_count())"
python -c "import torch; print(torch.cuda.get_device_name(0))"
```

**Solutions:**

1. Install NVIDIA GPU drivers
2. Install CUDA toolkit matching PyTorch version
3. Reinstall PyTorch with GPU support:
   ```bash
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
   ```

### Out of Memory (OOM) Errors

**During Training:**

```python
# Reduce batch size
Config.BATCH_SIZE = 16  # or 8

# Clear GPU cache between epochs
torch.cuda.empty_cache()

# Use gradient checkpointing (saves memory)
model.gradient_checkpointing_enable()
```

**During Inference:**

```python
# Process fewer images per batch
batch_size = 4

# Clear cache
torch.cuda.empty_cache()
```

### Slow Training

**Optimization steps:**

1. **Enable GPU:** Ensure CUDA is used
2. **Adjust batch size:** Try 64 or 128 (if memory allows)
3. **Reduce image size:** Change `IMAGE_SIZE = 192` (vs 224)
4. **Use lighter model:** Switch to MobileNetV3
5. **Increase workers:** Set `num_workers=4` (more for large datasets)

### Poor Model Performance

**If validation accuracy is low (<70%):**

1. **Increase augmentation:** Uncomment additional transforms in `get_transforms()`
2. **Train longer:** Increase `NUM_EPOCHS` to 200
3. **Better model:** Try ResNet50 instead of EfficientNet-B0
4. **Collect more data:** The 1,097 images may be insufficient for some use cases
5. **Fine-tune learning rate:** Try 5e-4 or 2e-3

**Check class balance:**

```python
# In training script, add:
from collections import Counter
class_counts = Counter(all_labels)
for class_name, count in class_counts.items():
    print(f"{class_name}: {count} images")
```

### API Errors

**"Model not loaded" Error:**

```
HTTPException: 503 - "Model not loaded"
```

Solution:
- Verify `model.pt` exists
- Verify `class_names.json` exists
- Check file permissions
- Restart API server

**"CORS errors" in browser:**

The API already has CORS enabled, but if you see CORS errors:

```python
# Already configured in app.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domains in production
    ...
)
```

**"File too large" Error:**

```
HTTPException: 400 - "File size exceeds 10MB limit"
```

Solution in `app.py`:

```python
class AppConfig:
    MAX_IMAGE_SIZE_MB = 20  # Increase limit
```

### Dataset Loading Issues

**"Module not found" - datasets:**

```bash
pip install datasets huggingface-hub
```

**"Network error" loading from Hugging Face:**

```python
# Offline mode (use cached data)
from datasets import load_dataset
dataset = load_dataset(
    "zakir22/Ethiopian-foods",
    cache_dir="./cache"
)

# Or download manually and use local path
dataset = load_dataset("imagefolder", data_dir="./local_data")
```

## 📈 Future Enhancements

- [ ] Multi-model ensemble for improved accuracy
- [ ] Real-time webcam inference demo
- [ ] Fine-grained analysis of dish components
- [ ] Integration with nutritional databases
- [ ] Recipe recommendations based on recognized food
- [ ] Model pruning and quantization for mobile
- [ ] Federated learning for privacy-preserving training
- [ ] Active learning for efficient data annotation
- [ ] Explainability (attention maps, feature visualization)
- [ ] Mobile app (iOS/Android)

## 📝 References & Acknowledgments

**Dataset:**
- [Hugging Face Ethiopian-foods Dataset](https://huggingface.co/datasets/zakir22/Ethiopian-foods)

**Pre-trained Models:**
- EfficientNet: [Tan & Le, 2019](https://arxiv.org/abs/1905.11946)
- ResNet: [He et al., 2015](https://arxiv.org/abs/1512.03385)
- MobileNetV3: [Howard et al., 2019](https://arxiv.org/abs/1905.02175)

**Libraries:**
- PyTorch: https://pytorch.org
- FastAPI: https://fastapi.tiangolo.com
- Timm: https://github.com/rwightman/pytorch-image-models

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add improvement'`)
4. Push to branch (`git push origin feature/improvement`)
5. Submit pull request

## 📄 License

MIT License - Free for personal and commercial use

## 📞 Support & Contact

For issues, questions, or suggestions:
- Open an GitHub Issue
- Submit a Pull Request
- Email: support@gursha.ai

---

**Built with ❤️ for Ethiopian food recognition and nutrition**

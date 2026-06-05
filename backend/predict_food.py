import os
import json
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image

# Load class names
CLASSES_FILE = os.path.join(os.path.dirname(__file__), "class_names.json")
with open(CLASSES_FILE, "r") as f:
    CLASSES = json.load(f)

NUM_CLASSES = len(CLASSES)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "ethiopian_food_model.pth")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Initialize model (matches train.py architecture)
def load_model():
    model = models.mobilenet_v3_large(weights=None)
    model.classifier[3] = nn.Linear(model.classifier[3].in_features, NUM_CLASSES)
    
    if os.path.exists(MODEL_PATH):
        model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    else:
        print(f"Warning: Model weights not found at {MODEL_PATH}. Using untrained model for demo purposes.")
        
    model = model.to(DEVICE)
    model.eval()
    return model

model = load_model()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def predict(image: Image.Image):
    """
    Takes a PIL Image and returns the top 3 predictions with confidence scores.
    """
    if image.mode != 'RGB':
        image = image.convert('RGB')
        
    img_t = transform(image).unsqueeze(0).to(DEVICE)
    
    with torch.no_grad():
        outputs = model(img_t)
        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
        
    # Get top 3 predictions
    top_prob, top_catid = torch.topk(probabilities, 3)
    
    results = []
    for i in range(top_prob.size(0)):
        results.append({
            "food": CLASSES[top_catid[i].item()],
            "confidence": float(top_prob[i].item())
        })
        
    return results

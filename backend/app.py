from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image
import predict_food

app = FastAPI(title="Gursha AI Backend", version="1.0.0")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database of nutritional info for Ethiopian foods
NUTRITION_DB = {
    "Shiro Wat": {
        "calories": 350,
        "protein_score": 85, # High vegan protein
        "fiber_score": 90,
        "vitamin_score": 60,
        "wellness_score": 82,
        "missing": "Vitamin C and some healthy fats.",
        "student_suggestion": "Great for focus, but add a side of cabbage (Tikel Gomen) for vitamins to stay alert during study sessions.",
        "ethioplate_coach": {
            "good": "Excellent plant-based protein and high fiber from chickpea flour.",
            "missing": "Lacking fresh greens and omega-3s.",
            "local_addition": "Add Gomen (collard greens) or a side salad with a touch of olive oil.",
            "budget_addition": "A boiled egg is a cheap way to round out the amino acid profile."
        }
    },
    "Tibs": {
        "calories": 550,
        "protein_score": 95,
        "fiber_score": 20,
        "vitamin_score": 40,
        "wellness_score": 70,
        "missing": "Dietary fiber and complex carbs.",
        "student_suggestion": "High protein keeps you full, but the heavy fats might make you sleepy. Eat smaller portions before an exam.",
        "ethioplate_coach": {
            "good": "Outstanding source of iron, B12, and high-quality protein.",
            "missing": "Needs more fiber to aid digestion and balance blood sugar.",
            "local_addition": "Pair with extra Injera (Teff is high fiber) and a side of Fasolia (green beans).",
            "budget_addition": "Ask for extra tomatoes and onions in the Tibs to add volume and vitamins cheaply."
        }
    },
    "Injera": {
        "calories": 150,
        "protein_score": 15,
        "fiber_score": 85,
        "vitamin_score": 50,
        "wellness_score": 75,
        "missing": "Protein and fat.",
        "student_suggestion": "Good complex carbs for sustained energy. Pair with Shiro or Misir for a balanced study meal.",
        "ethioplate_coach": {
            "good": "Teff is an ancient superfood, packed with iron, calcium, and resistant starch.",
            "missing": "It is mostly carbs; you need a protein source to build a complete meal.",
            "local_addition": "Any Wat (stew) like Misir (lentils) or Kik (split peas).",
            "budget_addition": "Shiro is the most budget-friendly and nutritious pairing."
        }
    },
    # Default fallback
    "Default": {
        "calories": 400,
        "protein_score": 60,
        "fiber_score": 60,
        "vitamin_score": 60,
        "wellness_score": 60,
        "missing": "Balance your macros.",
        "student_suggestion": "Ensure you get enough water and a balanced mix of protein and carbs for energy.",
        "ethioplate_coach": {
            "good": "Traditional Ethiopian food is generally well-spiced and communal.",
            "missing": "Make sure you have a good source of protein.",
            "local_addition": "Add Lentils or Eggs.",
            "budget_addition": "Vegetable sides are usually cheap and nutritious."
        }
    }
}

@app.get("/")
def read_root():
    return {"status": "Gursha ML API is running"}

@app.post("/api/scan")
async def scan_meal(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        image_bytes = await file.read()
        image = Image.open(BytesIO(image_bytes))
        
        # Run inference
        predictions = predict_food.predict(image)
        
        # Get the top prediction
        top_food = predictions[0]['food']
        confidence = predictions[0]['confidence']
        
        # Fetch nutritional info
        nutrition_info = NUTRITION_DB.get(top_food, NUTRITION_DB["Default"])
        
        return {
            "success": True,
            "predictions": predictions,
            "top_food": top_food,
            "confidence": confidence,
            "analysis": nutrition_info
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
async def predict_meal(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        image_bytes = await file.read()
        image = Image.open(BytesIO(image_bytes))
        
        # Run inference
        predictions = predict_food.predict(image)
        
        # Get the top prediction
        top_food = predictions[0]['food']
        confidence = predictions[0]['confidence']
        
        return {
            "predicted_food": top_food,
            "confidence": confidence
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

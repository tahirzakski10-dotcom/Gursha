"""
Ethiopian Food Recognition - FastAPI Application
==================================================

Production-ready REST API for Ethiopian food recognition inference.

Endpoints:
- POST /predict: Upload image and get prediction
- GET /health: Health check
- GET /info: Model information

Features:
- Async request handling
- Automatic GPU optimization
- Input validation
- Error handling
- CORS support
- Request logging

Usage:
    uvicorn app:app --host 0.0.0.0 --port 8000

Author: ML Engineering Team
Version: 1.0
"""

import os
import json
import io
import logging
from typing import Optional
from datetime import datetime

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import torch

from predict_food import EthiopianFoodPredictor, InferenceConfig


# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============================================================================
# APPLICATION CONFIGURATION
# ============================================================================

class AppConfig:
    """Application configuration"""
    
    # API Configuration
    TITLE = "Ethiopian Food Recognition API"
    DESCRIPTION = "AI-powered platform for identifying Ethiopian food dishes"
    VERSION = "1.0.0"
    
    # API Settings
    MAX_IMAGE_SIZE_MB = 10
    ALLOWED_IMAGE_FORMATS = {'JPEG', 'PNG', 'JPG'}
    REQUEST_TIMEOUT = 30
    
    # CORS
    ALLOW_CREDENTIALS = True
    ALLOWED_ORIGINS = ["*"]
    ALLOWED_METHODS = ["*"]
    ALLOWED_HEADERS = ["*"]
    
    # Model Settings
    TOP_K = 3


# ============================================================================
# FASTAPI APPLICATION INITIALIZATION
# ============================================================================

app = FastAPI(
    title=AppConfig.TITLE,
    description=AppConfig.DESCRIPTION,
    version=AppConfig.VERSION,
)

# Add CORS middleware for cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=AppConfig.ALLOWED_ORIGINS,
    allow_credentials=AppConfig.ALLOW_CREDENTIALS,
    allow_methods=AppConfig.ALLOWED_METHODS,
    allow_headers=AppConfig.ALLOWED_HEADERS,
)

# Global predictor instance (loaded once at startup)
predictor: Optional[EthiopianFoodPredictor] = None


# ============================================================================
# STARTUP AND SHUTDOWN EVENTS
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """
    Initialize resources when application starts.
    
    - Load the predictor model
    - Verify GPU availability
    - Log startup information
    """
    
    global predictor
    
    logger.info("Starting Ethiopian Food Recognition API...")
    logger.info(f"PyTorch Version: {torch.__version__}")
    logger.info(f"CUDA Available: {torch.cuda.is_available()}")
    
    if torch.cuda.is_available():
        logger.info(f"GPU Device: {torch.cuda.get_device_name(0)}")
        logger.info(f"GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
    
    try:
        # Load predictor
        predictor = EthiopianFoodPredictor()
        logger.info("✓ Model loaded successfully")
        
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        raise


@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources when application shuts down"""
    
    logger.info("Shutting down Ethiopian Food Recognition API...")
    
    # Clear GPU cache if available
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    
    logger.info("✓ Cleanup completed")


# ============================================================================
# DATA MODELS
# ============================================================================

from pydantic import BaseModel


class PredictionResult(BaseModel):
    """Response model for predictions"""
    
    predicted_food: str
    confidence: float
    top_k_predictions: list


class HealthResponse(BaseModel):
    """Response model for health check"""
    
    status: str
    timestamp: str
    gpu_available: bool
    device: str


class ModelInfo(BaseModel):
    """Response model for model information"""
    
    model_name: str
    num_classes: int
    class_names: list
    input_size: int
    device: str


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def validate_image(file: UploadFile) -> Image.Image:
    """
    Validate and load uploaded image.
    
    Args:
        file (UploadFile): Uploaded image file
    
    Returns:
        Image.Image: PIL Image object
    
    Raises:
        HTTPException: If image is invalid
    """
    
    # Check file size
    max_size = AppConfig.MAX_IMAGE_SIZE_MB * 1024 * 1024
    if len(file.file.getvalue()) > max_size:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds {AppConfig.MAX_IMAGE_SIZE_MB}MB limit"
        )
    
    # Check file format
    if file.content_type not in ['image/jpeg', 'image/png', 'image/jpg']:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image format. Allowed: JPEG, PNG"
        )
    
    try:
        # Load image
        image_data = file.file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Validate image
        image.verify()
        
        # Reopen after verify (verify closes the file)
        image = Image.open(io.BytesIO(image_data))
        
        return image
    
    except Exception as e:
        logger.error(f"Image validation failed: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image file: {str(e)}"
        )


# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get("/", tags=["Info"])
async def root():
    """
    Root endpoint with API information.
    
    Returns:
        dict: API title and description
    """
    return {
        "name": AppConfig.TITLE,
        "version": AppConfig.VERSION,
        "description": AppConfig.DESCRIPTION,
        "documentation": "/docs",
        "health_check": "/health",
        "model_info": "/info",
        "predict_endpoint": "/predict"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    
    Verifies that the API and model are running correctly.
    
    Returns:
        HealthResponse: Status information
    """
    
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        gpu_available=torch.cuda.is_available(),
        device=str(InferenceConfig.DEVICE)
    )


@app.get("/info", response_model=ModelInfo, tags=["Info"])
async def model_info():
    """
    Get model information.
    
    Returns information about the loaded model architecture
    and available classes.
    
    Returns:
        ModelInfo: Model details
    """
    
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return ModelInfo(
        model_name=predictor.model_name,
        num_classes=predictor.num_classes,
        class_names=predictor.class_names,
        input_size=InferenceConfig.IMAGE_SIZE,
        device=str(InferenceConfig.DEVICE)
    )


@app.post("/predict", response_model=PredictionResult, tags=["Prediction"])
async def predict(file: UploadFile = File(...)):
    """
    Predict Ethiopian food category from uploaded image.
    
    This endpoint accepts an image upload and returns the predicted
    food category along with confidence scores and top-3 predictions.
    
    Parameters:
        file (UploadFile): Image file (JPEG or PNG)
    
    Returns:
        PredictionResult: Prediction with top-3 alternatives
    
    Raises:
        HTTPException: If image is invalid or prediction fails
    
    Example Response:
        {
            "predicted_food": "Doro Wat",
            "confidence": 0.92,
            "top_k_predictions": [
                {"rank": 1, "food": "Doro Wat", "confidence": 0.92},
                {"rank": 2, "food": "Shiro Wat", "confidence": 0.05},
                {"rank": 3, "food": "Beyaynetu", "confidence": 0.03}
            ]
        }
    """
    
    # Check if predictor is loaded
    if predictor is None:
        logger.error("Predictor not loaded")
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Validate and load image
        logger.info(f"Validating image: {file.filename}")
        image = validate_image(file)
        
        # Make prediction
        logger.info(f"Making prediction for: {file.filename}")
        result = predictor.predict_from_array(
            np.array(image),
            top_k=AppConfig.TOP_K
        )
        
        logger.info(f"Prediction successful: {result['predicted_food']} " 
                   f"({result['confidence']:.2%})")
        
        return result
    
    except HTTPException:
        raise
    
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@app.post("/predict-batch", tags=["Prediction"])
async def predict_batch(files: list[UploadFile] = File(...)):
    """
    Batch prediction for multiple images.
    
    Parameters:
        files (list[UploadFile]): List of image files
    
    Returns:
        dict: List of predictions for each image
    """
    
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if len(files) > 32:
        raise HTTPException(
            status_code=400,
            detail="Maximum 32 images per batch request"
        )
    
    results = []
    
    for file in files:
        try:
            image = validate_image(file)
            result = predictor.predict_from_array(np.array(image), top_k=AppConfig.TOP_K)
            result['filename'] = file.filename
            results.append(result)
        except Exception as e:
            results.append({
                'filename': file.filename,
                'error': str(e)
            })
    
    return {"predictions": results}


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    
    logger.error(f"HTTP Exception: {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "timestamp": datetime.now().isoformat()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler"""
    
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "timestamp": datetime.now().isoformat()
        }
    )


# ============================================================================
# ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    print("\n" + "="*70)
    print("ETHIOPIAN FOOD RECOGNITION API")
    print("="*70)
    print(f"\nStarting server on http://0.0.0.0:8000")
    print(f"API Documentation: http://localhost:8000/docs\n")
    print("="*70 + "\n")
    
    # Start server
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )

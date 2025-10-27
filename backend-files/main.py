from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
from model import HairTypeClassifier
import numpy as np
import os

# Optional: Import Keras model functions
try:
    from keras_model import load_keras_model, preprocess_image_for_keras, predict_hair_damage
    KERAS_AVAILABLE = True
except ImportError:
    KERAS_AVAILABLE = False
    print("Keras not available or model helpers not imported")

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the model
model = HairTypeClassifier()
model.load_state_dict(torch.load('model/hair_type_model.pth', map_location=torch.device('cpu')))
model.eval()

keras_model = None
is_keras_saved_model = False

try:
    if KERAS_AVAILABLE:
        model_path = 'model/hair_damage_model'
        keras_model = load_keras_model(model_path)
        print("Keras model loaded successfully")
        is_keras_saved_model = os.path.isdir(model_path) and os.path.exists(os.path.join(model_path, 'saved_model.pb'))

except Exception as e:
    print(f"Error loading Keras model: {e}")

@app.post("/predict")
async def predict_hair_type(file: UploadFile = File(...)):
    # Read and preprocess the image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize image to match model input size
    image = image.resize((224, 224))
    
    # Convert to tensor and normalize
    image_tensor = torch.from_numpy(np.array(image)).float()
    image_tensor = image_tensor.permute(2, 0, 1)  # Change from HWC to CHW
    image_tensor = image_tensor / 255.0  # Normalize to [0, 1]
    
    # Add batch dimension
    image_tensor = image_tensor.unsqueeze(0)
    
    # Make prediction
    with torch.no_grad():
        prediction = model(image_tensor)
        probabilities = torch.softmax(prediction, dim=1)
        predicted_class = torch.argmax(probabilities, dim=1).item()
        confidence = probabilities[0][predicted_class].item()
    
    # Map class index to hair type
    hair_types = {
        0: "Curly",
        1: "Kinky",
        2: "Straight",
        3: "Wavy"
    }
    
    return {
        "hair_type": hair_types[predicted_class],
        "confidence": confidence
    }

@app.post("/predict-damage")
async def predict_hair_damage_endpoint(file: UploadFile = File(...)):
    # YOUR TASK: Write this endpoint (see hints above!)
    if not keras_model:
        return {"error": "Hair damage model not loaded"}
    
    # Read and preprocess the image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Preprocess for Keras model
    preprocessed_image = preprocess_image_for_keras(image)
    predicted_class_idx, confidence, all_predictions = predict_hair_damage(keras_model, preprocessed_image, is_keras_saved_model)
    
    # Map class index to damage level
    damage_levels = {
        0: "None",
        1: "Low",
        2: "Moderate",
        3: "High"
    }
    
    return {
        "damage_level": damage_levels[predicted_class_idx],
        "confidence": confidence,
        "all_probabilities": all_predictions.tolist()
    }

if __name__ == "__main__":
       import uvicorn
       uvicorn.run(app, host="0.0.0.0", port=8000)
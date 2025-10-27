import tensorflow as tf
from tensorflow import keras
import numpy as np
import os

def load_keras_model(model_path):
    try:
        if os.path.isdir(model_path) and os.path.exists(os.path.join(model_path, 'saved_model.pb')):
            model = tf.saved_model.load(model_path)
            print("SavedModel loaded successfully")
        else:
            model = keras.models.load_model(model_path)
            print("Model loaded successfully")

        return model

    except Exception as e:
        print(f"Error loading model: {e}")
        raise
    

def preprocess_image_for_keras(image, target_size=(224, 224)):

    image = image.resize(target_size)
    img_array = np.array(image)
    img_array = img_array / 255.0
    img_array = img_array.reshape(1, *img_array.shape)

    return img_array

def predict_hair_damage(model, image_array, is_saved_model=False):
    if is_saved_model:
        infer_fn = model.signatures['serving_default']
        predictions = infer_fn(tf.constant(image_array, dtype=tf.float32))
        output = list(predictions.values())[0].numpy()
    
    else:
        predictions = model.predict(image_array, verbose=0)
        output = predictions[0]

    predicted_class_idx = np.argmax(output) #retrieves the highes probability
    confidence = float(output[predicted_class_idx])
    
    return predicted_class_idx, confidence, output

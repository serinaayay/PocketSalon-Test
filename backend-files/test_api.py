import requests
import os
from PIL import Image
import io

def test_prediction_endpoint():
    # URL of your FastAPI endpoint
    url = "http://localhost:8000/predict"
    
    # Path to a test image (you can use any image from your dataset)
    test_image_path = "test_image.jpg"  # Make sure this file exists
    
    try:
        # Open and prepare the image
        with open(test_image_path, "rb") as image_file:
            files = {"file": ("test_image.jpg", image_file, "image/jpeg")}
            
            # Send POST request
            print("Sending request to backend...")
            response = requests.post(url, files=files)
            
            # Check if request was successful
            if response.status_code == 200:
                result = response.json()
                print("\nPrediction Results:")
                print(f"Hair Type: {result['hair_type']}")
                print(f"Confidence: {result['confidence']*100:.2f}%")
            else:
                print(f"Error: Received status code {response.status_code}")
                print(f"Response: {response.text}")
                
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server. Make sure the backend is running.")
    except FileNotFoundError:
        print(f"Error: Test image not found at {test_image_path}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    test_prediction_endpoint() 
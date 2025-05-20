import kagglehub
import os
import shutil

def download_test_image():
    print("Downloading dataset...")
    dataset_path = kagglehub.dataset_download("kavyasreeb/hair-type-dataset")
    
    # Find first image in the dataset
    for root, dirs, files in os.walk(dataset_path):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                source_path = os.path.join(root, file)
                # Copy to test_image.jpg
                shutil.copy2(source_path, 'test_image.jpg')
                print(f"Test image downloaded as 'test_image.jpg'")
                # Clean up dataset
                shutil.rmtree(dataset_path)
                return
    
    print("No images found in the dataset")

if __name__ == "__main__":
    download_test_image() 
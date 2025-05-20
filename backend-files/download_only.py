import kagglehub
import os

def download_dataset():
    print("Downloading dataset...")
    dataset_path = kagglehub.dataset_download("kavyasreeb/hair-type-dataset")
    print(f"Dataset downloaded to: {dataset_path}")
    print("You can now inspect the dataset in File Explorer.")
    print("For example, open:")
    print(os.path.join(dataset_path, 'data'))

if __name__ == "__main__":
    download_dataset() 
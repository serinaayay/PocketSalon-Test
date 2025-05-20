import os
import kagglehub
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
import numpy as np
from model import HairTypeClassifier, train_model
from sklearn.model_selection import train_test_split
import shutil
import sys

class HairTypeDataset(Dataset):
    def __init__(self, image_paths, labels, transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        image = Image.open(self.image_paths[idx]).convert('RGB')
        label = self.labels[idx]
        
        if self.transform:
            image = self.transform(image)
            
        return image, label

def prepare_dataset(dataset_path):
    # Define the hair type classes based on actual folder names
    hair_types = ['curly', 'kinky', 'Straight', 'Wavy']
    
    # Lists to store image paths and labels
    image_paths = []
    labels = []
    
    # Walk through the dataset directory (inside 'data' folder)
    for hair_type_idx, hair_type in enumerate(hair_types):
        hair_type_dir = os.path.join(dataset_path, "data", hair_type)
        if os.path.exists(hair_type_dir):
            for image_name in os.listdir(hair_type_dir):
                if image_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                    image_path = os.path.join(hair_type_dir, image_name)
                    image_paths.append(image_path)
                    labels.append(hair_type_idx)
    
    if not image_paths:
        raise ValueError(f"No images found in the dataset at {dataset_path}")
    
    print(f"Found {len(image_paths)} images in the dataset")
    return image_paths, labels

def main():
    try:
        # Check if kaggle credentials exist
        kaggle_dir = os.path.expanduser("~/.kaggle")
        if not os.path.exists(kaggle_dir):
            print("Error: Kaggle credentials not found!")
            print("Please follow these steps:")
            print("1. Go to https://www.kaggle.com/settings")
            print("2. Scroll to 'API' section")
            print("3. Click 'Create New API Token'")
            print("4. Create a .kaggle directory in your home folder")
            print("5. Move the downloaded kaggle.json file to the .kaggle directory")
            sys.exit(1)

        # Download dataset
        print("Downloading dataset...")
        dataset_path = kagglehub.dataset_download("kavyasreeb/hair-type-dataset")
        print(f"Dataset downloaded to: {dataset_path}")
        
        # Prepare dataset
        print("Preparing dataset...")
        image_paths, labels = prepare_dataset(dataset_path)
        
        # Split dataset into train and validation sets
        train_paths, val_paths, train_labels, val_labels = train_test_split(
            image_paths, labels, test_size=0.2, random_state=42, stratify=labels
        )
        
        print(f"Training set size: {len(train_paths)}")
        print(f"Validation set size: {len(val_paths)}")
        
        # Define transforms
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(10),
            transforms.ColorJitter(brightness=0.2, contrast=0.2),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # Create datasets
        train_dataset = HairTypeDataset(train_paths, train_labels, transform=transform)
        val_dataset = HairTypeDataset(val_paths, val_labels, transform=transform)
        
        # Create data loaders
        train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True, num_workers=4)
        val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False, num_workers=4)
        
        # Initialize model
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {device}")
        model = HairTypeClassifier().to(device)
        
        # Define loss function and optimizer
        criterion = torch.nn.CrossEntropyLoss()
        optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
        
        # Create model directory if it doesn't exist
        os.makedirs('model', exist_ok=True)
        
        # Train model
        print("Starting training...")
        model = train_model(model, train_loader, criterion, optimizer, num_epochs=20)
        
        # Save model
        torch.save(model.state_dict(), 'model/hair_type_model.pth')
        print("Model saved to model/hair_type_model.pth")
        
        # Clean up downloaded dataset
        print("Cleaning up...")
        shutil.rmtree(dataset_path)
        print("Training complete!")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 
import torch
import torch.nn as nn
import torchvision.models as models

class HairTypeClassifier(nn.Module):
    def __init__(self, num_classes=4):
        super(HairTypeClassifier, self).__init__()
        # Load pre-trained ResNet50
        self.resnet = models.resnet50(pretrained=True)
        
        # Freeze the ResNet layers
        for param in self.resnet.parameters():
            param.requires_grad = False
            
        # Replace the final fully connected layer
        num_features = self.resnet.fc.in_features
        self.resnet.fc = nn.Sequential(
            nn.Linear(num_features, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, num_classes)
        )
    
    def forward(self, x):
        return self.resnet(x)

def train_model(model, train_loader, criterion, optimizer, num_epochs=10):
    model.train()
    for epoch in range(num_epochs):
        running_loss = 0.0
        for inputs, labels in train_loader:
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
        
        print(f'Epoch {epoch+1}/{num_epochs}, Loss: {running_loss/len(train_loader)}')
    
    return model 
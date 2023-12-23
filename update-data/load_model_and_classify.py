import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
import torch
import torch.nn as nn
import pickle

class TextClassifier(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim, dropout_prob=0.5):
        super(TextClassifier, self).__init__()
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.dropout = nn.Dropout(dropout_prob)
        self.fc2 = nn.Linear(hidden_dim, output_dim)
    
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x
    
class Classifier(object):
    def __init__(self):
        # Load the saved parameters
        with open('best_params.pickle', 'rb') as handle:
            self.best_params = pickle.load(handle)

        # Load the vectorizer
        self.vectorizer = pickle.load(open("vectorizer.pickle", "rb"))
        self.input_dim = len(self.vectorizer.get_feature_names_out())

        # Initialize and load the saved model
        self.model = TextClassifier(input_dim=self.input_dim, hidden_dim=200, output_dim=18, dropout_prob=self.best_params['dropout_rate'])
        self.model.load_state_dict(torch.load('best_model.pt'))

    def ClassifyDF(self, df):
        # Let's assume your new data only has a 'Text' column
        texts = df['Text']

        # Convert the texts into vectors
        X = self.vectorizer.transform(texts)

        # Convert the vectors to PyTorch tensors
        X = torch.from_numpy(X.toarray()).float()

        # Predict labels for the new data
        with torch.no_grad():
            outputs = self.model(X)
            _, predicted = torch.max(outputs, 1)

        # Add the predicted labels to the DataFrame
        df['Predicted Labels'] = predicted.numpy()

        return df
    
    def classifyItem(self, content):
        texts = [content]

        # Convert the texts into vectors
        X = self.vectorizer.transform(texts)

        # Convert the vectors to PyTorch tensors
        X = torch.from_numpy(X.toarray()).float()

        # Predict labels for the new data
        with torch.no_grad():
            outputs = self.model(X)
            _, predicted = torch.max(outputs, 1)

        return predicted.numpy()[0]
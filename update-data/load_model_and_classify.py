# use the trained neural network to classify references based on the surrounding text

import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
import torch
import torch.nn as nn
import pickle

# neural network
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
    
# uses the neural network to classify references
class Classifier(object):
    def __init__(self):
        # load the model parameters
        with open('best_params.pickle', 'rb') as handle:
            self.best_params = pickle.load(handle)

        # load vectorizer
        self.vectorizer = pickle.load(open("vectorizer.pickle", "rb"))
        self.input_dim = len(self.vectorizer.get_feature_names_out())

        # initialize and load model
        self.model = TextClassifier(input_dim=self.input_dim, hidden_dim=200, output_dim=18, dropout_prob=self.best_params['dropout_rate'])
        self.model.load_state_dict(torch.load('best_model.pt'))

    def classify_item(self, content):
        # put content in array
        texts = [content]

        # vectorize content
        X = self.vectorizer.transform(texts)

        # vectors -> tensors
        X = torch.from_numpy(X.toarray()).float()

        # run the NN predictions
        with torch.no_grad():
            outputs = self.model(X)
            _, predicted = torch.max(outputs, 1)

        # return the prediction
        return predicted.numpy()[0]
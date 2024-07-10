import joblib
import pandas as pd
import os
from sklearn.preprocessing import LabelEncoder
import pickle
import numpy as np

# Define paths to your model pickle files
LIVESTOCK_MODEL_PATH = '../training/livestock/livestock.pkl'
PETS_MODEL_PATH = '../training/pets/pets.pkl'
POULTRY_MODEL_PATH = '../training/poultry/poultry.pkl'
LIVESTOCK_ENCODER = '../training/livestock/livestock_label_encoder.pkl'
PETS_ENCODER = '../training/pets/pets_label_encoder.pkl'
POULTRY_ENCODER = './training/poultry/poultry_label_encoder.pkl'

def read_from_file(f):
    symptoms_dict = {}
    df = pd.read_csv(f)

    for idx, col in enumerate(df.columns):
        symptoms_dict[idx] = col
    
    return symptoms_dict

pet_type_mapping = {
    'cat': 0,
    'dog': 1,
    'parrot': 2,
}

livestock_type_mapping = {
    'cow': 1,
    'buffalo': 0,
    'sheep': 3,
    'goat': 2,
}

poultry_type_mapping = {
    'chicken': 0,
}


# Function to load a specific model from pickle file
def load_models(animal_type):
    if animal_type in ['cow', 'buffalo', 'sheep', 'goat']:
        model_path = LIVESTOCK_MODEL_PATH
        encoder_path = LIVESTOCK_ENCODER
    elif animal_type in ['dog', 'cat', 'parrot']:
        model_path = PETS_MODEL_PATH
        encoder_path = PETS_ENCODER
    elif animal_type == 'chicken':
        model_path = POULTRY_MODEL_PATH
        encoder_path = POULTRY_ENCODER
    else:
        raise ValueError(f"Invalid animal type '{animal_type}'. Supported types are 'livestock', 'pets', or 'poultry'.")

    model = joblib.load(open(model_path, 'rb'))
    encoder = np.load(encoder_path, allow_pickle=True)
    
    return model, encoder


def predict_disease(animal_type, symptoms):
    try:
        model, encoder = load_models(animal_type)
        #print(model)
        print(f"Loaded model type: {type(model)}")
        
        if animal_type in pet_type_mapping:
            encoded_value = pet_type_mapping[animal_type]
        elif animal_type in livestock_type_mapping:
            encoded_value = livestock_type_mapping[animal_type]
        elif animal_type in poultry_type_mapping:
            encoded_value = poultry_type_mapping[animal_type]
        else:
            raise ValueError(f"Animal type '{animal_type}' not found in mapping")
        print(f"label : {encoded_value}")

        if hasattr(model, 'feature_names_in_'):
            feature = model.feature_names_in_
            print("Input feature names: ", feature)

        symptoms_dict = {f: 0 for f in feature}
        print(symptoms_dict)

        first = feature[0]
        symptoms_dict[first] = encoded_value

        for symptom in symptoms:
            if symptom.strip() in symptoms_dict:
                symptoms_dict[symptom.strip()] = 1

        print(symptoms_dict)

        symptom_array = np.array([list(symptoms_dict.values())])
        print(symptom_array)
        pred = model.predict(symptom_array)
        print(pred)
        return pred.tolist()
    except Exception as e:
        print(f"Error predicting disease: {e}")
        return None
import joblib
import pandas as pd
import os
from sklearn.preprocessing import OneHotEncoder

# Define paths to your model pickle files
LIVESTOCK_MODEL_PATH = '../training/livestock/livestock.pkl'
PETS_MODEL_PATH = '../training/pets/pets.pkl'
POULTRY_MODEL_PATH = '../training/poultry/poultry.pkl'


# Function to load a specific model from pickle file
def load_models(animal_type):
    if animal_type in ['cow', 'buffalo', 'sheep', 'goat']:
        with open(LIVESTOCK_MODEL_PATH, 'rb') as f:
            model = joblib.load(f)
    elif animal_type in ['dog', 'cat', 'parrot']:
        with open(PETS_MODEL_PATH, 'rb') as f:
            model = joblib.load(f)
    elif animal_type == 'chicken':
        with open(POULTRY_MODEL_PATH, 'rb') as f:
            model = joblib.load(f)
    else:
        raise ValueError(f"Invalid animal type '{animal_type}'. Supported types are 'livestock', 'pets', or 'poultry'.")

    print(f"Loaded model type: {type(model)}")
    return model

def load_encoder():
    with open(ENCODER_PATH, 'rb') as f:
        encoder = pickle.load(f)
    return encoder

# def load_models():
#     with open('../training/livestock/livestock.pkl', 'rb') as f:
#         livestock_model = pickle.load(f)

#     with open('../training/pets/pets.pkl', 'rb') as f:
#         pets_model = pickle.load(f)

#     with open('../training/poultry/poultry.pkl', 'rb') as f:
#         poultry_model = pickle.load(f)

    
def predict_disease(animal_type, symptoms):
    # Load the appropriate model based on animal type
    #model = load_models(animal_type)
    # Assuming symptoms is a list of symptom values
    #df = pd.DataFrame([symptoms])
    #print(df)
    #prediction = model.predict(df)
    #return prediction[0]
    try:
        model = load_models(animal_type)
        #print(model)
        symptoms = [symptom.strip() for symptom in symptoms]
        print(symptoms)
        df = pd.DataFrame([symptoms])
        print(f"Input DataFrame: {df}")
        prediction = model.predict(df)
        print("Prediction: {prediction}")
        return prediction[0]
    except Exception as e:
        print(f"Error predicting disease: {e}")
        return None
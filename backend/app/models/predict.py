import pickle
import pandas as pd

# Define paths to your model pickle files
LIVESTOCK_MODEL_PATH = '../training/livestock/livestock.pkl'
PETS_MODEL_PATH = '../training/pets/pets.pkl'
POULTRY_MODEL_PATH = '../training/poultry/poultry.pkl'

# Function to load a specific model from pickle file
def load_models(animal_type):
    if animal_type == 'livestock':
        with open(LIVESTOCK_MODEL_PATH, 'rb') as f:
            return pickle.load(f)
    elif animal_type == 'pets':
        with open(PETS_MODEL_PATH, 'rb') as f:
            return pickle.load(f)
    elif animal_type == 'poultry':
        with open(POULTRY_MODEL_PATH, 'rb') as f:
            return pickle.load(f)
    else:
        raise ValueError(f"Invalid animal type '{animal_type}'. Supported types are 'livestock', 'pets', or 'poultry'.")


# def load_models():
#     with open('../training/livestock/livestock.pkl', 'rb') as f:
#         livestock_model = pickle.load(f)

#     with open('../training/pets/pets.pkl', 'rb') as f:
#         pets_model = pickle.load(f)

#     with open('../training/poultry/poultry.pkl', 'rb') as f:
#         poultry_model = pickle.load(f)

    
def predict_disease(animal_type, symptoms):
    # Load the appropriate model based on animal type
    model = load_models(animal_type)

    # Assuming symptoms is a list of symptom values
    df = pd.DataFrame([symptoms])
    prediction = model.predict(df)
    return prediction[0]

# Main program execution
if __name__ == '__main__':
    # Example usage
    animal_type = 'pets'  # Example: 'livestock', 'pets', 'poultry'
    symptoms = ['fever', 'vomiting', 'difficulty breathing', 'cough']
    result = predict_disease(animal_type, symptoms)
    print(f"Predicted disease: {result}")
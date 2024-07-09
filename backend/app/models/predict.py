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
    # with open(f, 'r') as file:
    #     for line in file:
    #         symptom = line.strip()
    #         if symptom:
    #             symptoms_dict[symptom] = 0
    # return symptoms_dict

pet_type_mapping = {
    'cat': 0,
    'dog': 1,
    'parrot': 2,
}


# Function to load a specific model from pickle file
def load_models(animal_type):
    if animal_type in ['cow', 'buffalo', 'sheep', 'goat']:
        #with open(LIVESTOCK_MODEL_PATH, 'rb') as f:
        model_path = LIVESTOCK_MODEL_PATH
        #csv_path = '../training/livestock/animal_disease_dataset.csv'
        encoder_path = LIVESTOCK_ENCODER
    elif animal_type in ['dog', 'cat', 'parrot']:
        #with open(PETS_MODEL_PATH, 'rb') as f:
        model_path = PETS_MODEL_PATH
        #csv_path = '../training/pets/pets_disease_dataset.csv'
        encoder_path = PETS_ENCODER
    elif animal_type == 'chicken':
        #with open(POULTRY_MODEL_PATH, 'rb') as f:
        model_path = POULTRY_MODEL_PATH
        #csv_path = './training/poultry/poultry_disease_dataset.csv'
        encoder_path = POULTRY_ENCODER
    else:
        raise ValueError(f"Invalid animal type '{animal_type}'. Supported types are 'livestock', 'pets', or 'poultry'.")

    model = joblib.load(open(model_path, 'rb'))
    encoder = np.load(encoder_path, allow_pickle=True)
    #print(f"Loaded model type: {type(model)}")

    return model, encoder

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
        model, encoder = load_models(animal_type)
        #print(model)
        print(f"Loaded model type: {type(model)}")
        
        if animal_type in pet_type_mapping:
            encoded_value = pet_type_mapping[animal_type]
        else:
            raise ValueError(f"Animal type '{animal_type}' not found in mapping")
        #original_label = encoder.inverse_transform([encoded_value])
        print(f"label : {encoded_value}")

        #current_dir = os.path.dirname(os.path.abspath(__file__))
        #file_path = os.path.join(current_dir, 'files', 'dog.txt')

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
        # if hasattr(model, 'coef_'):
        #     feature_names = model.coef_.shape[1]  # This gives number of columns
        # elif hasattr(model, 'feature_importances_'):
        #     feature_names = len(model.feature_importances_)
        # else:
        #     feature_names = None  # Handle other cases

        # print("Feature names or number of features:", feature_names)
        # #print(encoder)
        # symptoms = [symptom.strip() for symptom in symptoms]
        # print(symptoms)

        # arr = np.array([symptoms])
        # print(arr)
        # pred = model.predict(arr)
        # print(pred)
        # return pred

        # features_name = model.feature_names_in_

        # input_data = {feature: 0 for feature in features_name}

        # for symptom in symptoms:
        #     if symptom in input_data:
        #         input_data[symptom] = 1

        # symptoms_df = pd.DataFrame([input_data]).reindex(columns = features_name, fill_value=0)

        # prediction = model.predict(symptoms_df)

        # if hasattr(encoder, 'inverse_transform'):
        #     predicted_disease = encoder.inverse_transform(prediction)[0]
        # else:
        #     predicted_disease = prediction[0]
        
        # return predicted_disease
        # # symptoms_df = pd.DataFrame(columns=encoder)
        # input_data = {symptom: 0 for symptom in encoder}

        # for symptom in symptoms:
        #     if symptom in input_data:
        #         input_data[symptom] = 1

        # symptoms_df = pd.DataFrame([input_data])

        # #symptoms_df = symptoms_df.append(input_data, ignore_index = True)

        # prediction = model.predict(symptoms_df)

        # if hasattr(encoder, 'inverse_transform'):
        #     predicted_disease = encoder.inverse_transform(prediction)[0]
        # else:
        #     predicted_disease = prediction[0] 
        # return predicted_disease        
        # # Ensure all expected symptom columns exist and initialize them to 0
        # unique_symptoms = encoder.classes_
        # for symptom in unique_symptoms:
        #     symptoms_df[symptom] = 0
        
        # # Set columns for provided symptoms to 1
        # for symptom in symptoms:
        #     if symptom in symptoms_df.columns:
        #         symptoms_df[symptom] = 1
        
        # # Drop the original symptom columns
        # symptoms_df.drop(['Symptom1', 'Symptom2', 'Symptom3', 'Symptom4'], axis=1, inplace=True)
        
        # # Make prediction
        # encoded_prediction = model.predict(symptoms_df)
        # if hasattr(encoder, 'inverse_transform'):
        #     predicted_disease = encoder.inverse_transform(encoded_prediction)[0]
        # else:
        #     predicted_disease = encoded_prediction[0]
        # return predicted_disease
    except Exception as e:
        print(f"Error predicting disease: {e}")
        return None

    #     df = pd.DataFrame([symptoms])
    #     print(f"Input DataFrame: {df}")
    #     prediction = model.predict(df)
    #     print("Prediction: {prediction}")
    #     return prediction[0]
    # except Exception as e:
    #     print(f"Error predicting disease: {e}")
    #     return None
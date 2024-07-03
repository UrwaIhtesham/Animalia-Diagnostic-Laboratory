from flask import Blueprint, request, jsonify
from ..models.predict import predict_disease

bp = Blueprint('main', __name__)

@bp.route('/predict', methods=['POST'])
def predict():
    #extracting json data from request
    data = request.json

    #store animal type from JSON data
    animal_type = data.get('animal_type')

    #store symptoms from JSON data
    symptoms = data.get('symptoms')

    if animal_type and symptoms:
        #call prdecit_disease function from '/app/models/predict.py'
        prediction = predict_disease(animal_type, symptoms)

        #Return a JSON data with disease and prediction and status code 200 (OK)
        return jsonify({'disease': prediction}), 200
    else:
        #return error with status code 400 (Bad Request)
        return jsonify({'error': 'Invalid input'}), 400

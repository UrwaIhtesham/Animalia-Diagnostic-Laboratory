from flask import Blueprint, request, jsonify
from flask_cors import CORS
from app.models.predict import predict_disease

bp = Blueprint('main', __name__)

@bp.route('/predict', methods =['POST'])
def predict():
    data = request.json
    animal_type = data.get('animal_type')
    symptoms = data.get('symptoms')

    # Print animal_type and symptoms for debugging
    print(f"Received animal_type: {animal_type}")
    print(f"Received symptoms: {symptoms}")

    if animal_type and symptoms:
        prediction = predict_disease(animal_type, symptoms)
        if prediction is not None:
            return jsonify({'disease': prediction}), 200
        else:
            return jsonify({'error': 'Prediction failed'}), 500
    else:
        return jsonify({'error': 'Invalid input'}), 400
    
from app import create_app

app = create_app()
app.register_blueprint(bp, url_prefix='/')
CORS(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
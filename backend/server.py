from flask import Flask, Blueprint, request, jsonify, session
from flask_cors import CORS

from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import os

from app.models.users.user import db, User
from app.routes import register_all_blueprints
from app.models.predict import predict_disease

app = Flask(__name__)

import secrets
sk = secrets.token_hex(16)
app.config['SECRET_KEY'] = sk
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Password123*@localhost/animalia'

SQLALCHEMY_TRACK_MODIFICATIONS = False 
app.config['SQLALCHEMY_ECHO'] = True

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/users', methods=['GET'])
def listuser():
    all_users = User.query.all()
    results = [{"id": user.id, "name": user.name, "email": user.email, "Created At": user.date_added} for user in all_users]
    return jsonify(results)


@app.route('/register', methods=['POST'])
def register():
    print("Inside Add user")
    name=request.json['name']
    email = request.json['email']
    password = request.json['password']

    print(name)
    print(email)
    print(password)
    
    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "Email already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })

@app.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized Access"}), 401
        
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })

@app.route('/predict', methods =['POST'])
def predict():
    data = request.json
    animal_type = data.get('animal_type')
    symptoms = data.get('symptoms')

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

register_all_blueprints(app)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
from functools import wraps
from flask import Flask, Blueprint, request, jsonify, session, redirect, url_for
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
import os
import secrets
from sqlalchemy.sql import not_
from app.models.users.user import db, User
from app.models.doctors.doctor import db, Doctors
from app.models.appointments.appointment import db, Appointments
from app.routes import register_all_blueprints
from app.models.predict import predict_disease
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
import datetime
from datetime import timedelta
app = Flask(__name__)

sk = secrets.token_hex(16)
app.config['SECRET_KEY'] = sk
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Password123*@localhost/animalia'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True




jwt = JWTManager(app)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})

db.init_app(app)

with app.app_context():
    db.create_all()


def generate_token():
     token=sk
     return token

@app.route('/users', methods=['GET'])
def listuser():
    print("Request received")  # Debug statement
    auth_header = request.headers.get('Authorization')
    print(auth_header)
    if auth_header is None:
        return jsonify({'error': 'Unauthorized access'}), 401
    else:
        exclude = 'admin@gmail.com'
        all_users = User.query.filter(User.email != exclude).all()
        results = [{"id": user.id, "name": user.name, "email": user.email, "Created At": user.date_added} for user in all_users]
        return jsonify(results)
        
    


@app.route('/register', methods=['POST'])
def register():

    name = request.json['name']
    email = request.json['email']
    password = request.json['password']

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "Email already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    # session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })
@app.route('/adddoctors', methods=['POST'])
def addDoctor():
     newdoctor = request.json
     print(newdoctor)
     return jsonify({
          "Doctor added successfully"
     }),201
@app.route('/login', methods=['POST'])
def login():

    email = request.json['email']
    password = request.json['password']

    user = User.query.filter_by(email=email).first()

    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized access"}), 401

    # Debug print
    
    token = generate_token()
    print("In login", token)
    app.config.setdefault('TOKENS', {})[token] = user.id
    return jsonify({
        "id": user.id,
        "email": user.email,
        "token" : token
    })

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    # session["logged_in"] = False
    
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/predict', methods=['POST'])
def predict():
        print("Request received")  # Debug statement
        auth_header = request.headers.get('Authorization')
        print(auth_header)
        if auth_header is None:
                return jsonify({'error': 'Unauthorized access'}),401
    
        data = request.json
        animal_type = data.get('animal_type')
        symptoms = data.get('symptoms')

        if animal_type and symptoms:
            prediction = predict_disease(animal_type, symptoms)
            if prediction is not None:
                return jsonify({'disease': prediction}), 200
            else:
                return jsonify({'error': 'Prediction failed'}), 500
        else:
            return jsonify({'error': 'Invalid input'}), 400

register_all_blueprints(app)

@app.route('/doctors', methods=['GET'])
def get_doctors():
        
        print("Request received")  # Debug statement
        auth_header = request.headers.get('Authorization')
        print(auth_header)
        if auth_header is None:
             return jsonify({'error': 'Unauthorized access'}),401
        else:
            available_doctors = Doctors.query.filter_by().all()
            doctors_list = [
                {
                    'id': doctor.id,
                    'name': doctor.name,
                    'specialization': doctor.specialization,
                    'fees': doctor.fee,
                    'experience': doctor.experience,
                    'timing': doctor.timing,
                    'day': doctor.day
                } for doctor in available_doctors
            ]
            print("In doctors api",doctors_list)
            return jsonify(doctors_list)


@app.route('/appointments', methods=['POST'])
def appointment():

    print("Request received")  # Debug statement
    auth_header = request.headers.get('Authorization')
    print(auth_header)
    if auth_header is None:
            return jsonify({'error': 'Unauthorized access'}),401
    
    if not request.is_json:
        return jsonify({"error": "No JSON payload provided"}), 400

    data = request.get_json()

    if 'docid' not in data:
        return jsonify({"error": "Missing 'docid' in payload"}), 400

    try:
        existing_appointment = Appointments.query.filter_by(
            doctorid=data['docid'],
            day=data['selectedDay'],
            time=data['selectedTime']
        ).first()

        if existing_appointment:
            return jsonify({"error": "An appointment already exists for this doctor at the selected day and time. Please select another day or time."}), 409

        
        new_appointment = Appointments(
            doctorid=data['docid'],
            useremail=data['useremail'],
            fee=data['fee'],
            day=data['selectedDay'],
            time=data['selectedTime']
        )
        db.session.add(new_appointment)
        db.session.commit()
        return jsonify({"success": "Appointment added"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/getappointments', methods=['GET'])
def getappointments():
    print("Request received")  # Debug statement
    auth_header = request.headers.get('Authorization')
    print(auth_header)
    if auth_header is None:
        return jsonify({'error': 'Unauthorized access'}), 401
    else:
        
        all_appointments = Appointments.query.filter_by().all()
        results = [{"id": appointment.id, "doctorid": appointment.doctorid, "email": appointment.useremail, "fee": appointment.fee, "day": appointment.day, "timing": appointment.time} for appointment in all_appointments]
        return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

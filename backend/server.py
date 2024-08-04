from flask import Flask, Blueprint, request, jsonify, session, redirect, url_for
from flask_cors import CORS

from functools import wraps
from flask_jwt_extended import JWTManager

from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import os

from app.models.users.user import db, User
from app.models.doctors.doctor import db, Doctors
from app.models.appointments.appointment import db, Appointments
from app.models.labtests.bookedtests import db, BookTests
from app.models.labtests.labtest import db, Tests
from app.routes import register_all_blueprints
from app.models.predict import predict_disease

from sqlalchemy.sql import text

app = Flask(__name__)

import secrets
sk = secrets.token_hex(16)
app.config['SECRET_KEY'] = sk
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Password123*@localhost/animalia'

SQLALCHEMY_TRACK_MODIFICATIONS = False 
app.config['SQLALCHEMY_ECHO'] = True

jwt=JWTManager(app)
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
    # all_users = User.query.all()
    # results = [{"id": user.id, "name": user.name, "email": user.email, "Created At": user.date_added} for user in all_users]
    # return jsonify(results)
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
    }), 201

@app.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized Access"}), 401
    
    if user.email == 'admin@gmail.com':
        usertype="admin"
    else:
        usertype="user"
        
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id

    token = generate_token()
    print("In login", token)
    app.config.setdefault('TOKENS', {})[token] = user.id


    return jsonify({
        "id": user.id,
        "email": user.email,
        "user type": usertype
    }), 201

@app.route('/logout', methods=['GET', 'POST'])
def logout():    
    return jsonify({"message": "Logged out successfully"}), 200


@app.route('/animals', methods=['GET'])
def get_animals():
    try:
        # Execute the query to get distinct animal types
        sql=text('SELECT DISTINCT animal FROM tests')
        animals = db.session.execute(sql).fetchall()
        # Convert the result to a list of animal names
        animal_list = [row[0] for row in animals]
        print(animal_list)
        return jsonify(animal_list)
    except Exception as e:
        # Log the error and return a 500 error response
        print(f"Error fetching animals: {e}")
        return jsonify({"error": "An error occurred while fetching animals."}), 500

@app.route('/alltests', methods=['GET'])
def get_all_tests():
    try:
        tests = Tests.query.all()

        tests_list = [
            {
                'test id': test.testid,
                'test name': test.testname,
                'animal': test.animal,
                'Fee': test.testfee
            } for test in tests
        ]
        return jsonify(tests_list)
    except Exception as e:
        print(f"Error fetching tesrs: {e}")
        return jsonify({"error": "An error occured while fetcing tests"}), 500
    
@app.route('/addtest', methods=['POST'])
def addtest():
    data = request.json
    new_test = Tests(testname=data['name'], testfee=data['testfees'], animal=data['animal'])
    db.session.add(new_test)
    db.session.commit()
    return jsonify({"message": "Test added succesfully"}), 201

@app.route('/tests', methods=['GET'])
def get_tests():
    animal = request.args.get

@app.route('/book_labtest', methods=['POST'])
def book_labtest():
    data = request.json
    customeremail = data['email']
    selectedTests = data['selectedtests']
    bookings = []

    print("customer email", customeremail)
    print("Selected Tests", selectedTests)

    user = User.query.filter_by(email=customeremail).first()

    print("User", user)

    if not user:
        return jsonify({"error":"User not found"}), 404
    
    customerid = user.id

    for test in selectedTests:
        test_details=Tests.query.filter_by(testid=test['id']).first()
        if test_details:
            booking = BookTests(
                test_id = test_details.testid,
                customerid = customerid,
                testname = test_details.testname,
                fees = test_details.testfee,
                animal = test_details.animal,
                payment_status='Paid',
                test_status = 'In Progress'
            )
            print(booking)
            bookings.append(booking)

        db.session.add(booking)
        db.session.commit()
    return jsonify({"message": "Booking succesful"}), 201

@app.route('/bookedlabtests', methods=['GET'])
def list_booked():
    all_booked = BookTests.query.all()
    results = [
        {
            "book test id": booked.booktest_id,
            "test id": booked.test_id,
            "customer id": booked.customerid,
            "test name": booked.testname,
            "fees": booked.fees,
            "animal": booked.animal,
            "payment status": booked.payment_status,
            "test status": booked.test_status,
            "url": booked.url
        }
        for booked in all_booked
    ]
    return jsonify(results)

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


@app.route('/doctors', methods=['GET'])
def get_doctors():
    available_doctors = Doctors.query.filter_by(status='available').all()
    doctors_list = [
        {
            'id': doctor.id,
            'name': doctor.name,
            'specialization': doctor.specialization,
            'fees': doctor.fee,
            'experience': doctor.experience,
            'days': doctor.day,
            'timing': doctor.timing
        } for doctor in available_doctors
    ]
    print(doctors_list)
    return jsonify(doctors_list)

register_all_blueprints(app)

@app.route('/adddoctors', methods=['POST'])
def add_doctor():
    try:
        data = request.json
        print(data)
        new_doctor = Doctors(
            name=data['name'],
            specialization=data['specialization'],
            fee=data['fee'],
            experience=data['experience'],
            day=data['days'],
            timing=data['time'],
            status='available'
        )
        db.session.add(new_doctor)
        db.session.flush()  # Ensure changes are sent to the database
        db.session.commit()  # Commit the transaction
        return jsonify({"message": "Doctor added successfully"}), 200
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        print(f"Error: {e}")
        return jsonify({"error": "Failed to add doctor"}), 500
 
@app.route('/appointment', methods=['POST'])
def appointment():
    print("Inside appointment")
    return jsonify({'error': 'Invalid input'}), 400

from app import create_app



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
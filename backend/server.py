from flask import Flask, Blueprint, request, jsonify, session,send_file,redirect, url_for
from flask_cors import CORS

from functools import wraps
from flask_jwt_extended import JWTManager

from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import os
import boto3
import zipfile
from werkzeug.utils import secure_filename
from app.models.users.user import db, User
from app.models.doctors.doctor import db, Doctors
from app.models.appointments.appointment import db, Appointments
from app.models.labtests.bookedtests import db, BookTests
from app.models.labtests.labtest import db, Tests
from app.routes import register_all_blueprints
from app.models.predict import predict_disease
from dotenv import load_dotenv
from io import BytesIO
import mimetypes

from sqlalchemy.sql import text
load_dotenv()

app = Flask(__name__)

app = Flask(__name__)

import secrets
sk = secrets.token_hex(16)
app.config['SECRET_KEY'] = sk
 
 # Set the database URI dynamically
db_username = os.getenv('DB_USERNAME')
db_password = os.getenv('DB_PASSWORD')
db_url = os.getenv('DB_URL')  # Use 'DB_HOST' instead of 'DB_URL'
db_name = os.getenv('DB_NAME')

# Configure the SQLAlchemy database URI
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{db_username}:{db_password}@"
    f"{db_url}/{db_name}"
         )
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
#just for testing

jwt=JWTManager(app)
bcrypt = Bcrypt(app)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", 
"http://animalia-frontend-bucket.s3-website-us-east-1.amazonaws.com",
"http://animalia-frontend-bucket.s3-website-us-east-1.amazonaws.com/admin/"]}})
db.init_app(app)

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')


with app.app_context():
    db.create_all()

def generate_token():
    token=sk
    return token


@app.route('/Results', methods=['POST'])
def result():
    try:
        data = request.json
        email = data['email']
        print(f"Received email: {email}")
        # Fetch the customer id and tests related to the customer id linked to the email from the database table
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        customer_id = user.id
        tests = BookTests.query.filter_by(customerid=customer_id).all()
        
        if not tests:
            return jsonify({"error": "No tests found for user"}), 404
        
        # Prepare ZIP file in memory
        memory_file = BytesIO()
        with zipfile.ZipFile(memory_file, 'w', zipfile.ZIP_DEFLATED) as zf:
            for test in tests:
                if test.url:
                    filename = test.url.split('/')[-1]
                    print(f"Fetching file: {filename} from S3")
                    s3_response = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=filename)
                    file_content = s3_response['Body'].read()
                    zf.writestr(test.testname, file_content)
        
        memory_file.seek(0)
        print("ZIP file created successfully")
        return send_file(memory_file, mimetype='application/zip', download_name='test_results.zip')
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/getTestResult', methods=['POST'])
def get_test_result():
    try:
        data = request.json
        test_id = data['testId']
        customer_id = data['customerId']
        # Fetch the URL from the database
        file_url = get_file_url_from_db(test_id, customer_id)
        
        if file_url:
            # Extract the file name from URL
            filename = file_url.split('/')[-1]
            print(f"Filename: {filename}")
            # Download file from S3
            s3_response = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=filename)
            file_content = s3_response['Body'].read()
            content_type = mimetypes.guess_type(filename)[0] or 'application/octet-stream'
            # Send file to frontend
            return send_file(BytesIO(file_content), download_name=filename, mimetype=content_type)


        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_file_url_from_db(test_id, customer_id):
    try:
        # Query the database for the record matching the test_id and customer_id
        booked_test = BookTests.query.filter_by(test_id=test_id, customerid=customer_id).first()
        
        # Check if the record exists and return the URL
        if booked_test and booked_test.url:
            return booked_test.url
        else:
            return None
    except Exception as e:
        print(f"Error retrieving file URL from database: {e}")
        return None




@app.route('/updateTestResult', methods=['POST'])
def update_test_result():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        test_id = request.form.get('testId')
        customer_id = request.form.get('customerId')
        
        # Query the BookTests table to find a matching record
        booked_test = BookTests.query.filter_by(test_id=test_id, customerid=customer_id).first()

        if not booked_test:
            return jsonify({"error": "Test not found."}), 404

        # Generate a unique file name for the upload
        filename = f"{customer_id}_{test_id}_{file.filename}"

        try:
            # Upload file to S3
            s3_client.upload_fileobj(file, S3_BUCKET_NAME, filename)
            file_url = f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{filename}"

            # Update the URL in the database
            booked_test.url = file_url
            db.session.commit()

            return jsonify({"message": "Test result URL updated successfully.", "url": file_url})
        except Exception as e:
            return jsonify({"error": str(e)}), 500


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

@app.route('/', methods=['GET'])
def test():
    return jsonify("hehe")

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

    token = generate_token()
    print("In register", token)
    app.config.setdefault('TOKENS', {})[token] = new_user.id


    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        'token': token
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
        "token":token
    }), 201

@app.route('/logout', methods=['GET', 'POST'])
def logout(): 
    print("Request received")  # Debug statement
    auth_header = request.headers.get('Authorization')
    print(auth_header)
    if auth_header is None:
        return jsonify({'error': 'Unauthorized access'}),401
       
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
    print("Request received")  # Debug statement
    auth_header = request.headers.get('Authorization')
    print(auth_header)
    if auth_header is None:
        return jsonify({'error': 'Unauthorized access'}),401
    
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
    print("Request received")  # Debug statement
    auth_header = request.headers.get('Authorization')
    print(auth_header)
    if auth_header is None:
        return jsonify({'error': 'Unauthorized access'}),401
    
    data = request.json
    test_name = data.get('name')
    animal = data.get('animal')

    existing = Tests.query.filter_by(testname=test_name, animal=animal).first()

    if existing:
        return jsonify({"error": "Test with the same name and animal already exists."}), 400

    new_test = Tests(testname=data['name'], testfee=data['testfees'], animal=data['animal'])
    db.session.add(new_test)
    db.session.commit()
    return jsonify({"message": "Test added succesfully"}), 201

@app.route('/tests', methods=['GET'])
def get_tests():
    animal = request.args.get


@app.route('/addtest', methods=['POST'])
def addtest():
    data = request.json
    new_test = Tests(testname=data['name'], testfee=data['testfees'], animal=data['animal'])
    db.session.add(new_test)
    db.session.commit()
    return jsonify({"message": "Test added succesfully"}), 201

@app.route('/book_labtest', methods=['POST'])
def book_labtest():
    print("Request received")  # Debug statement
    auth_header = request.headers.get('Authorization')
    print(auth_header)
    if auth_header is None:
        return jsonify({'error': 'Unauthorized access'}),401
    
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
    print("Request received")  # Debug statement
    auth_header = request.headers.get('Authorization')
    print(auth_header)
    if auth_header is None:
        return jsonify({'error': 'Unauthorized access'}),401
    
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
    print("Request received")  # Debug statement
    auth_header = request.headers.get('Authorization')
    print(auth_header)
    if auth_header is None:
        return jsonify({'error': 'Unauthorized access'}),401
    
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
    


register_all_blueprints(app)


@app.route('/doctors', methods=['GET'])
def get_doctors():
    print("Request received")  # Debug statement
    auth_header = request.headers.get('Authorization')
    print(auth_header)
    if auth_header is None:
        return jsonify({'error': 'Unauthorized access'}),401
    else:
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
    print("Request received")  # Debug statement
    auth_header = request.headers.get('Authorization')
    print(auth_header)
    if auth_header is None:
        return jsonify({'error': 'Unauthorized access'}),401
    
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

@app.route('/insights', methods=['GET'])
def get_insights():
    print("Request Recieved in insights")
    auth_header = request.headers.get('Authorization')
    print(auth_header)
    if auth_header is None:
        return jsonify({'error': 'Unauthorized Access'}), 401
    else:
        try:
            user_count = User.query.count()
            test_count = Tests.query.count()
            booked_test_count = BookTests.query.count()
            appointment_count = Appointments.query.count()

            insights = {
                "users": user_count,
                'tests': test_count,
                'booked_tests': booked_test_count,
                'appointments': appointment_count
            }

            return jsonify(insights), 200
        except Exception as e:
            print(f"An error occurred: {e}")
            return jsonify({'error':'Internal Server Error'}), 500

@app.route('/revenue', methods=['GET'])
def get_revenue():
    print("Request Recieved in insights")
    auth_header = request.headers.get('Authorization')
    print(auth_header)
    if auth_header is None:
        return jsonify({'error': 'Unauthorized Access'}), 401
    else:
        try:
            booked_appoint_revenue = Appointments.query.all()
            booked_test_revenue = BookTests.query.all()

            tests_count=0
            tests_count = sum(appointment.fee for appointment in booked_appoint_revenue)

            appoint_count = 0
            appoint_count=sum(test.fees for test in booked_test_revenue)

            total = tests_count + appoint_count
            print(total)

            result = {
                'tests_count': tests_count,
                'appoint_count': appoint_count,
                'total': total
            }

            return jsonify({'revenue':result}), 200
        except Exception as e:
            print(f"An error occurred: {e}")
            return jsonify({'error': 'Internal Server Error'}), 500
 
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
        # Perform a join between Appointments and Doctors
        all_appointments = db.session.query(Appointments, Doctors).join(Doctors, Appointments.doctorid == Doctors.id).all()
        
        # Format the results to include doctor's name
        results = [{
            "id": appointment.Appointments.id,
            "email": appointment.Appointments.useremail,
            "doctorid": appointment.Appointments.doctorid,
            "doctorname": appointment.Doctors.name,
            "fee": appointment.Appointments.fee,
            "day": appointment.Appointments.day,
            "timing": appointment.Appointments.time
        } for appointment in all_appointments]
        
        return jsonify(results)

        # all_appointments = Appointments.query.filter_by().all()
        # results = [{"id": appointment.id, "email": appointment.useremail, "doctorid": appointment.doctorid, "fee": appointment.fee, "day": appointment.day, "timing": appointment.time} for appointment in all_appointments]
        # return jsonify(results)

from app import create_app



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)
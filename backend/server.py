from flask import Flask, Blueprint, request, jsonify, session
from flask_cors import CORS
from app.models.predict import predict_disease
#from app.routes.auth import auth_bp
from app import create_app, db
from dotenv import load_dotenv

from flask_bcrypt import Bcrypt

from app.routes import register_all_blueprints

from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from flask_wtf import FlaskForm

from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
#from flask_mysqldb import MySQL

from flask_sqlalchemy import SQLAlchemy #, inspect, MetaData, create_engine
from datetime import datetime

from app.models.users.user import db, User

import os

#load_dotenv()
app = Flask(__name__)
#app = create_app()
#CORS(app)
#CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Allow CORS for your frontend URL


#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Password123*@localhost/anemalia'
#db = SQLAlchemy(app)

import secrets
sk = secrets.token_hex(16)
app.config['SECRET_KEY'] = sk
#app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Password123*@localhost/animalia'

SQLALCHEMY_TRACK_MODIFICATIONS = False 
SQLALCHEMY_ECHO = True

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)

db.init_app(app)

# inspector = inspect(db.engine)

# if inspector.has_table('User'):
#     print("Table User exist")
# else:
#     print("Table does not exist")

with app.app_context():
    #db.drop_all()
    db.create_all()

# class UserSchema(ma.Schema):
#     class Meta:
#         fields = ('id', 'name', 'email', 'password')

# user_schema = UserSchema()
# users_schema = UserSchema(many=True)

# class UserForm(FlaskForm):
#     name = StringField("Name", validators=[DataRequired()])
#     email = StringField("Email", validators=[DataRequired()])
#     password = StringField("Password", validators=[DataRequired()])
#     submit = SubmitField("SUbmit")

@app.route('/users', methods=['GET'])
def listuser():
    all_users = User.query.all()
    results = [{"id": user.id, "name": user.name, "email": user.email, "Created At": user.date_added} for user in all_users]
    return jsonify(results)


@app.route('/register', methods=['POST'])
def register():
    print("Inside Add user")
    # data = request.get_json()
    # name = data.get('name')
    # email = data.get('email')
    # password = data.get('password')
    # confirm_password = data.get('confirm_password')
    name=request.json['name']
    email = request.json['email']
    password = request.json['password']

    print(name)
    print(email)
    print(password)
    #print("Password:", confirm_password)
    # hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # cur = mysql.connection.cursor()
    # cur.execute("INSERT INTO registereduser (name, email, password) VALUES (%s, %s, %s)", (name, email, hashed_password))
    # mysql.connection.commit()
    # cur.close()

    # if password != confirm_password:
    #     return jsonify(message='Passwords do not match'), 400
    
    # hashed_password = generate_password_hash(password).decode('utf-8')

    #users = User(name=name, email=email, password=password)

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

    # cur = mysql.connection.cursor()
    # cur.execute("INSERT INTO registereduser (name, email,password) VALUES (%s, %s,%s)", (name, email, hashed_password))
    # mysql.connection.commit()
    # cur.close

    #new_user = Users(name=name, email=email, password=hashed_password)
    # db.session.add(users)
    # db.session.commit()

    # # response = jsonify(message='User registered successfully!')
    # # response.headers.add('ACcess-Control-Allow-Origin', '*')
    # # print(response)
    # print(user_schema.jsonify(users))
    # return user_schema.jsonify(users), 201


# bp = Blueprint('logginin', __name__)
@app.route('/login', methods=['POST'])
def login():
    #data = request.get_json()
    email = request.json['email']
    password = request.json['password']

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized Access"}), 401
        #access_token = create_access_token(identity = user.id)
        #return jsonify(auth=True, token=access_token), 200
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })
    # else:
    #     return jsonify(auth=False, message='Invalid email or password'), 401

bp = Blueprint('prediction', __name__)
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

#app = create_app()
#app.register_blueprint(bp, url_prefix='/')
register_all_blueprints(app)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
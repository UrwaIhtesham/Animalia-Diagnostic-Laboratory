from flask import Flask
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

bcrypt = Bcrypt()
jwt = JWTManager()
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    db_username = os.getenv('DB_USERNAME')
    db_password = os.getenv('DB_PASSWORD')
    db_url = os.getenv('DB_URL')  # Use 'DB_HOST' instead of 'DB_URL'
    db_name = os.getenv('DB_NAME')

# Configure the SQLAlchemy database URI
    app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{db_username}:{db_password}@"
    f"{db_url}/{db_name}"
         ) 
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", 
"http://animalia-frontend-bucket.s3-website-us-east-1.amazonaws.com",
"http://animalia-frontend-bucket.s3-website-us-east-1.amazonaws.com/admin"]}})
    return app
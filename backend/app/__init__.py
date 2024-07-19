from flask import Flask
#from flask_mysqldb import MySQL
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

#mysql = MySQL()
bcrypt = Bcrypt()
jwt = JWTManager()
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
<<<<<<< HEAD
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:Password123*@localhost/anemalia'
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    #CORS(app)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Allow CORS for your frontend URL

=======
>>>>>>> origin/urwa/login_signup
    # Import blueprints here to avoid circular imports
    #app.register_blueprint(main_bp, url_prefix='/main')

    # Register blueprints
    # from app.routes import register_all_blueprints
    # register_all_blueprints(app)

    return app

# Delayed import
#from app import routes  # Assuming routes are defined in another module

# Or register blueprints inside create_app to avoid circular imports

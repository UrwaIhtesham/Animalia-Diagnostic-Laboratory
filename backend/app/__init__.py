from flask import Flask
from .routes import main

#Function to create and configure the Flask application instance.

def create_app():
    app = Flask(__name__)
    
    # Register main blueprints in the application
    app.register_blueprint(main.bp)
    
    return app

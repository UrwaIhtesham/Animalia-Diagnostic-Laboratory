from flask import Flask

def create_app():
    app = Flask(__name__)
    # Import blueprints here to avoid circular imports
    #app.register_blueprint(main_bp, url_prefix='/main')

    return app

# Delayed import
#from app import routes  # Assuming routes are defined in another module

# Or register blueprints inside create_app to avoid circular imports

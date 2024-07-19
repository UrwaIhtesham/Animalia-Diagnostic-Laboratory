def register_blueprints(app):
    from app.routes.main import main_bp
    app.register_blueprint(main_bp, url_prefix='/main')
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

# Register all blueprints
def register_all_blueprints(app):
    register_blueprints(app)

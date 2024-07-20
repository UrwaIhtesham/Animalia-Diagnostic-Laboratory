def register_blueprints(app):
    from app.routes.main import main_bp
    app.register_blueprint(main_bp, url_prefix='/main')

# Register all blueprints
def register_all_blueprints(app):
    register_blueprints(app)

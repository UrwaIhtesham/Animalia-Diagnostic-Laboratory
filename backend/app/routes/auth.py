from flask import Blueprint, request, jsonify
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mysqldb import MySQL

auth_bp = Blueprint('auth', __name__)
#bp = Blueprint('logginin', __name__)
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = Users.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity = user.id)
        return jsonify(auth=True, token=access_token), 200
    else:
        return jsonify(auth=False, message='Invalid email or password'), 401

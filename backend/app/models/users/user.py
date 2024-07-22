from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

#Creating a model 
class User(db.Model):
    __tablename__ = "Users"
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(2000), nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable = False)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
        self.date_added = datetime.now(timezone.utc)
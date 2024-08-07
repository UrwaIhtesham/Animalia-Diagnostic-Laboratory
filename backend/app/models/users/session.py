from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from flask_session import Session

db = SQLAlchemy()

class UserSession(db.Model):
    __tablename__ = 'sessions'
    id = db.Column(db.Integer, primary_key=True)
    session_data = db.Column(db.Text)
    #expire_date = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable = False)

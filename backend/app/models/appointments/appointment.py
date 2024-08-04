from app.models.users.user import db


class Appointments(db.Model):
    __tablename__ = 'appointment'
    id = db.Column(db.Integer, primary_key=True)
    doctorid = db.Column(db.Integer, nullable=False)
    useremail = db.Column(db.String(50),nullable=False)
    fee = db.Column(db.Integer,nullable=False)
    day = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    
    def __repr__(self):
        return f'{self.id}'
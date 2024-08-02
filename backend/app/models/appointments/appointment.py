from app.models.users.user import db


class Appointments(db.Model):
    __tablename__ = 'appointment'
    id = db.Column(db.Integer, primary_key=True)
    doctorid = db.Column(db.Integer)
    useremail = db.Column(db.String(50))
    fee = db.Column(db.Integer)
    
    def __repr__(self):
        return f'{self.name}'
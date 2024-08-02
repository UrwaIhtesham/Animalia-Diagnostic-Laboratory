from app.models.users.user import db


class Doctors(db.Model):
    __tablename__ = 'doctors'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    specialization = db.Column(db.String(50))
    fee = db.Column(db.Integer)
    experience = db.Column(db.Integer)
    timing = db.Column(db.String(50))
    status = db.Column(db.String(20))
    def __repr__(self):
        return f'{self.name}'
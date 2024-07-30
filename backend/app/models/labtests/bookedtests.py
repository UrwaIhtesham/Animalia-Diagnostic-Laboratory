from app.models.users.user import db
from app.models.labtests.labtest import Tests
from app.models.users.user import User

class BookTests(db.Model):
    __tablename__ = 'BookTests'
    booktest_id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    test_id = db.Column(db.Integer, db.ForeignKey('tests.testid'), nullable=False)
    customerid = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    testname = db.Column(db.String(500), nullable=False)
    fees = db.Column(db.Integer, nullable=False)
    animal=db.Column(db.String(50), nullable=False)
    payment_status = db.Column(db.String(20), nullable=False, default='Pending')
    test_status = db.Column(db.String(50), nullable=False, default="In Progress")
    url = db.Column(db.String(500))
    
    test = db.relationship('Tests', backref=db.backref('bookings', lazy=True))
    U = db.relationship('User', backref=db.backref('bookings', lazy=True))
from app.models.users.user import db


class Tests(db.Model):
    __tablename__ = 'tests'
    testid = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    testname = db.Column(db.String(50), nullable=False)
    testfee = db.Column(db.Integer, nullable=False)
    animal = db.Column(db.String(50), nullable=False)
    test_status = db.Column(db.String(50), nullable=False, default="In Progress")
    
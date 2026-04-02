from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='student')
    name = db.Column(db.String(120))
    surname = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    city = db.Column(db.String(120))
    region = db.Column(db.String(120))

class StuDate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False)
    resume = db.Column(db.String(255))
    video = db.Column(db.String(255))
    test = db.Column(db.String(255))
    essay = db.Column(db.String(255))
    unt = db.Column(db.String(255))
    ai_rate = db.Column(db.Integer)
    rate_comittee = db.Column(db.Integer)
    fin_rate = db.Column(db.Integer)
    ai_report = db.Column(db.Text)
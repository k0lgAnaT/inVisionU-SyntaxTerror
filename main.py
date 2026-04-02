from flask import Flask, jsonify, redirect

from auth.auth import auth
from admin.admin import admin
from comittee.comittee import comittee
from student.student import student

from models import db

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hackathon.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(admin, url_prefix='/admin')
app.register_blueprint(comittee, url_prefix='/comittee')
app.register_blueprint(student, url_prefix='/student')

@app.route('/')
def main():
    return redirect('/auth/login')

if __name__ == "__main__":
    with app.app_context():
        db.create_all();
    app.run(debug=True)
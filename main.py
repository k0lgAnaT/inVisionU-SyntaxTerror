from flask import Flask

from auth.auth import auth
from admin.admin import admin
from comittee.comittee import comittee
from student.student import student

app = Flask(__name__)

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(admin, url_prefix='/admin')
app.register_blueprint(comittee, url_prefix='/comittee')
app.register_blueprint(student, url_prefix='/student')

@app.route('/')
def index():
    return "Hello"

if __name__ == "__main__":
    app.run(debug=True)
from flask import Blueprint, request, session, redirect
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__, template_folder='templates', static_folder='static')

users = {} #The database example

@auth.route("/login", methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        username = request.form['']
        password = request.form['']

        user_password = users.get(username)

        if user_password and check_password_hash(user_password, password):
            session['user'] = username
            return redirect('')
        
        return 'Login went unsuccessfully'

    return 'Login went successfully'

@auth.route("registration")
def reg():
    return 'registration'

@auth.route("/reset")
def reset():
    return 'reset password'

@auth.route("/confirmation")
def confirm():
    return 'code confirmation'

@auth.route("/new-password")
def new_password():
    return 'New Password'
from flask import Blueprint, render_template, request, session, redirect
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__, template_folder='templates', static_folder='static')

users = {} #The database example

@auth.route("/login", methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user_password = users.get(username)

        if user_password and check_password_hash(user_password, password):
            session['user'] = username
            return redirect('')
        
        return 'Login went unsuccessfully'

    return 'Login went successfully'

@auth.route("registration", methods=['POST', 'GET'])
def reg():
    username = request.form['username']
    password = request.form['password']
    email = request.form['email']

    if username in users:
        return "User already exists"

    users[username] = {
        "password": generate_password_hash(password),
        "email": email
    }

    return "Registration successful"

@auth.route("/reset", methods=['GET', 'POST'])
def reset():
    if request.method == 'POST':
        email = request.form['email']
        return redirect('/confirmation')

    return render_template("reset.html")

@auth.route("/confirmation", methods=['GET', 'POST'])
def confirm():
    if request.method == 'POST':
        code = request.form['code']
        # проверка
        return redirect('/new-password')

    return render_template("confirm.html")

@auth.route("/new-password")
def new_password():
    return 'New Password'
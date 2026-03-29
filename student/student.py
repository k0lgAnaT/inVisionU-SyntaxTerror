from flask import Blueprint

student = Blueprint('student', __name__, template_folder='templates', static_folder='static')

@student.route("/")
def main_student():
    return "Main page Student"
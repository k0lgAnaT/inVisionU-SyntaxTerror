from flask import Blueprint

student = Blueprint('student', __name__, template_folder='templates', static_folder='static')

@student.route("/test")
def main_student():
    return "Test page Student"

@student.route("/profile")
def profile_student():
    return "Profile page Student"

@student.route("/enrollment")
def enrollment_student():
    return "Enrollment page Student"

@student.route("/about")
def about_student():
    return "About page Student"
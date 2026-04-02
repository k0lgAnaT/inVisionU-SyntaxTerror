from flask import Blueprint

comittee = Blueprint('comittee', __name__, template_folder='templates', static_folder='static')

@comittee.route('/')
def main_com():
    return 'Comittee Main Page'

@comittee.route('/profile')
def profile_com():
    return 'Comittee Profile Page'

@comittee.route('/rate')
def rate_com():
    return 'Comittee Rate Page'

@comittee.route('/interview')
def interview_com():
    return 'Comittee Interview Page'
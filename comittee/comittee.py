from flask import Blueprint

comittee = Blueprint('comittee', __name__, template_folder='templates', static_folder='static')

@comittee.route('/')
def main_com():
    return 'Comittee Main Page'
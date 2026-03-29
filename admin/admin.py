from flask import Blueprint

admin = Blueprint('admin', __name__, template_folder='templates', static_folder='static')

@admin.route('/')
def main_admin():
    return 'Admin Main Page'


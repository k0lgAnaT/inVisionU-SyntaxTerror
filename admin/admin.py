from flask import Blueprint

admin = Blueprint('admin', __name__, template_folder='templates', static_folder='static')

@admin.route('/')
def main_admin():
    return 'Admin Main Page'

@admin.route('/profile')
def profile_admin():
    return 'Admin Profile Page'

@admin.route('/appointment')
def appointment_admin():
    return 'Committee Appointment Page'

@admin.route('/manage')
def manage_admin():
    return 'Manage Committee Page'


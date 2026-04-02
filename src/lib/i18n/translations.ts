export type Language = 'ru' | 'en' | 'kz';

export const translations = {
  ru: {
    // Nav
    nav_dashboard: 'Дашборд',
    nav_leaderboard: 'Лидерборд',
    nav_validation: 'Валидация',
    nav_upload: 'Загрузка',
    nav_test: 'Тест',
    nav_admission: 'Поступление',
    nav_about: 'О нас',
    nav_status: 'Статус',
    nav_logout: 'Выйти',
    nav_api_online: 'API Онлайн',
    
    // Auth
    auth_welcome: 'Добро пожаловать!',
    auth_login_sub: 'Войдите в систему для продолжения',
    auth_student: 'Студент',
    auth_admin: 'Администратор',
    auth_email_pass: 'Пароль или E-mail',
    auth_password: 'Пароль (Password)',
    auth_forgot: 'Забыли пароль?',
    auth_login_btn: 'Вход',
    auth_no_account: 'У вас еще нет аккаунта?',
    auth_register_link: 'Зарегистрироваться',
    
    // Profiles
    prof_title: 'Профиль пользователя',
    prof_role: 'Роль',
    prof_commission_panel: 'Управление комиссией',
    prof_add_commission: 'Добавить члена комиссии',
    prof_add_btn: 'Создать',
  },
  en: {
    // Nav
    nav_dashboard: 'Dashboard',
    nav_leaderboard: 'Leaderboard',
    nav_validation: 'Validation',
    nav_upload: 'Upload',
    nav_test: 'Test',
    nav_admission: 'Admission',
    nav_about: 'About',
    nav_status: 'Status',
    nav_logout: 'Log Out',
    nav_api_online: 'API Online',
    
    // Auth
    auth_welcome: 'Welcome back!',
    auth_login_sub: 'Log in to continue',
    auth_student: 'Student',
    auth_admin: 'Admin',
    auth_email_pass: 'Email or Login',
    auth_password: 'Password',
    auth_forgot: 'Forgot password?',
    auth_login_btn: 'Sign In',
    auth_no_account: 'Do not have an account?',
    auth_register_link: 'Register',

    // Profiles
    prof_title: 'User Profile',
    prof_role: 'Role',
    prof_commission_panel: 'Commission Management',
    prof_add_commission: 'Add Commission Member',
    prof_add_btn: 'Create',
  },
  kz: {
    // Nav
    nav_dashboard: 'Бақылау тақтасы',
    nav_leaderboard: 'Көшбасшылар тақтасы',
    nav_validation: 'Тексеру',
    nav_upload: 'Жүктеп алу',
    nav_test: 'Тест',
    nav_admission: 'Қабылдау',
    nav_about: 'Біз туралы',
    nav_status: 'Мәртебе',
    nav_logout: 'Шығу',
    nav_api_online: 'API Желіде',
    
    // Auth
    auth_welcome: 'Қош келдіңіз!',
    auth_login_sub: 'Жалғастыру үшін жүйеге кіріңіз',
    auth_student: 'Студент',
    auth_admin: 'Әкімші',
    auth_email_pass: 'Электрондық пошта немесе логин',
    auth_password: 'Құпиясөз',
    auth_forgot: 'Құпиясөзді ұмыттыңыз ба?',
    auth_login_btn: 'Кіру',
    auth_no_account: 'Тіркелгіңіз жоқ па?',
    auth_register_link: 'Тіркелу',

    // Profiles
    prof_title: 'Пайдаланушы профилі',
    prof_role: 'Рөл',
    prof_commission_panel: 'Комиссияны басқару',
    prof_add_commission: 'Комиссия мүшесін қосу',
    prof_add_btn: 'Құру',
  }
};

export type TranslationKey = keyof typeof translations.ru;

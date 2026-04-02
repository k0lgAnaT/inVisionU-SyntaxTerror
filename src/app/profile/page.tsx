'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [role, setRole] = useState<'student' | 'admin' | 'commission' | null>(null);
  const [userName, setUserName] = useState('');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as 'student' | 'admin' | 'commission' | null;
    if (!savedRole) {
      router.push('/login');
    } else {
      setRole(savedRole);
      setUserName(localStorage.getItem('userName') || '');
      setStatus(localStorage.getItem('admissionStatus') || 'pending');
    }
  }, [router]);

  if (!role) return null;

  const getRoleDisplayName = () => {
    if (role === 'admin') return t('auth_admin');
    if (role === 'commission') return 'Член комиссии';
    return t('auth_student');
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href={role === 'student' ? '/student' : '/'} className="text-sm font-semibold text-slate-500 hover:text-brand-600 mb-4 inline-block">← Назад</Link>
          <h1 className="text-3xl font-display font-bold text-slate-800">{t('prof_title')}</h1>
          <p className="text-slate-600 mt-2">Управление вашим аккаунтом ({getRoleDisplayName()})</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main User Card */}
          <div className="md:col-span-1">
            <div className="glass-card-static p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center text-slate-500 font-bold text-2xl mb-4 overflow-hidden">
                {role === 'student' ? 'DL' : role === 'admin' ? 'A' : 'C'}
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {userName ? userName : (role === 'student' ? 'Студент' : role === 'admin' ? 'Admin User' : 'Иван Иванов (Комиссия)')}
              </h2>
              <div className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-semibold mt-2">
                {getRoleDisplayName()}
              </div>
            </div>
          </div>

          {/* Conditional Profile Details */}
          <div className="md:col-span-2 space-y-6">
            
            <div className="glass-card-static p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Детали аккаунта</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">E-mail</label>
                  <div className="font-medium text-slate-800">
                    {role === 'student' ? (userName ? `${userName.toLowerCase().split(' ').join('.')}@invision-u.kz` : 'student@invision-u.kz') : role === 'admin' ? 'admin@invision-u.kz' : 'commission@invision-u.kz'}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Язык интерфейса</label>
                  <div className="font-medium text-slate-800">Русский (изменяется в меню)</div>
                </div>
              </div>
            </div>

            {/* Student Specific */}
            {role === 'student' && (
              <div className={`p-6 rounded-2xl border ${
                status === 'invited' ? 'bg-emerald-50 border-emerald-200' :
                status === 'rejected' ? 'bg-red-50 border-red-200' :
                'bg-brand-50 border-brand-200'
              }`}>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Статус заявки</h3>
                <p className="text-sm text-slate-600 mb-4">
                  {status === 'invited' ? 'Приглашен на интервью! Проверьте вашу почту для деталей.' :
                   status === 'rejected' ? 'К сожалению, статус заявки отклонен.' :
                   'Ваши документы загружены и находятся на модерации.'}
                </p>
                <Link href="/student/admission" className="text-brand-600 font-semibold text-sm hover:underline">Проверить материалы →</Link>
              </div>
            )}

            {/* Admin Specific */}
            {role === 'admin' && (
              <div className="glass-card-static p-6 bg-slate-800 text-white border-none">
                <h3 className="text-lg font-bold text-white mb-2">{t('prof_commission_panel')}</h3>
                <p className="text-sm text-slate-400 mb-4">Только администратор может формировать состав приемной комиссии.</p>
                <Link href="/admin/users" className="bg-brand-500 text-white rounded-lg px-4 py-2 font-semibold text-sm inline-block transition hover:bg-brand-400">
                  {t('prof_add_commission')} →
                </Link>
              </div>
            )}

            {/* Commission Specific */}
            {role === 'commission' && (
              <div className="glass-card-static p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Назначенные абитуриенты</h3>
                <p className="text-sm text-slate-600 mb-4">Вам пока не назначены кандидаты для ручной проверки эссе.</p>
                <Link href="/" className="text-brand-600 font-semibold text-sm hover:underline">Перейти в общий дашборд →</Link>
              </div>
            )}

          </div>

        </div>
      </main>
    </>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function RegisterPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [firstName, setFirstName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock registration delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      localStorage.setItem('userName', firstName);
      localStorage.setItem('userRole', 'student');
    }, 1000);
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="glass-card-static max-w-md w-full p-8 text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-brand-400 text-black rounded-full flex items-center justify-center text-3xl mx-auto mb-6">✓</div>
          <h1 className="text-2xl font-display font-bold text-slate-800 mb-2">
            {t('auth_register_title')}!
          </h1>
          <p className="text-slate-600 mb-6">
            {t('auth_welcome_msg')}
          </p>
          <Link href="/login" className="btn-primary w-full block py-3 text-center">
            {t('auth_login_link')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-card-static max-w-lg w-full p-8 animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-1 bg-brand-50 rounded-xl mb-4 border border-brand-100">
            <div className="text-brand-600 font-display font-black text-xl px-4 py-1">inVision U</div>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-800 mb-1">
            {t('auth_register_title')}
          </h1>
          <p className="text-xs text-slate-500">{t('auth_register_sub')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                {t('auth_full_name')}
              </label>
              <input required type="text" className="input-field" placeholder="Aigerim" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                {t('auth_city')}
              </label>
              <input required type="text" className="input-field" placeholder="Almaty" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">
              {t('auth_email_pass')}
            </label>
            <input required type="email" className="input-field" placeholder="applicant@invision-u.kz" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">
              {t('auth_password')}
            </label>
            <input required minLength={6} type="password" className="input-field" placeholder="••••••••" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">
               {t('auth_phone')}
            </label>
            <input required type="tel" className="input-field" placeholder="+7 777 777 77 77" />
          </div>

          <div className="text-[10px] text-slate-400 mt-2 mb-6 text-center leading-tight">
            {t('auth_privacy')}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? '...' : t('auth_register_btn')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          {t('auth_already_have')} <Link href="/login" className="text-brand-600 font-semibold hover:underline">{t('auth_login_link')}</Link>
        </div>
      </div>
    </main>
  );
}

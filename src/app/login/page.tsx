'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LoginPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [roleMode, setRoleMode] = useState<'student' | 'staff'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    
    // MOCK AUTHENTICATION: 
    setTimeout(() => {
      let finalRole = 'student';
      if (roleMode === 'staff') {
        if (email.toLowerCase().includes('admin')) {
          finalRole = 'admin';
        } else {
          finalRole = 'commission';
        }
      }

      localStorage.setItem('userRole', finalRole);
      localStorage.setItem('userName', email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + email.split('@')[0].split('.')[0].slice(1));
      
      // Redirect based on role
      const target = finalRole === 'student' ? '/student' : '/';
      window.location.href = target;
      
      // Fallback in case redirect takes time
      setTimeout(() => setLoading(false), 2000);
    }, 800);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      
      {/* Decorative background map (subtle) */}
      <div className="map-bg pointer-events-none absolute inset-0"></div>

      <div className="glass-card-static max-w-md w-full p-8 animate-fade-in z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-1 bg-brand-50 rounded-xl mb-4 border border-brand-100">
            <div className="text-brand-600 font-display font-black text-xl px-4 py-1">inVision U</div>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-800 mb-1">{t('auth_welcome')}</h1>
          <p className="text-xs text-slate-500">{t('auth_login_sub')}</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button 
            type="button"
            onClick={() => { setRoleMode('student'); setEmail('diana.lee@invision-u.kz'); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${roleMode === 'student' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500'}`}
          >
            {t('auth_student')}
          </button>
          <button 
            type="button"
            onClick={() => { setRoleMode('staff'); setEmail('admin@invision-u.kz'); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${roleMode === 'staff' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500'}`}
          >
            Сотрудник
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">{t('auth_email_pass')}</label>
            <input 
              required 
              type="text" 
              className="input-field" 
              placeholder="applicant@invision-u.kz" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {roleMode === 'staff' && (
              <p className="text-[10px] text-slate-400 mt-1 pl-1">Подсказка: Введите 'admin...' для демо-Admin, любое другое для Комиссии.</p>
            )}
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-semibold text-slate-600 block">{t('auth_password')}</label>
              <a href="#" className="text-xs text-slate-400 hover:text-brand-600 transition-colors">{t('auth_forgot')}</a>
            </div>
            <input 
              required 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-4 text-base shadow-sm relative overflow-hidden">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {t('nav_api_online')}...
              </span>
            ) : t('auth_login_btn')}
          </button>
        </form>

        {roleMode === 'student' && (
          <div className="mt-8 text-center text-sm text-slate-600 border-t border-slate-100 pt-6">
            {t('auth_no_account')} <br/>
            <Link href="/register" className="text-brand-600 font-semibold hover:underline mt-1 inline-block">{t('auth_register_link')}</Link>
          </div>
        )}
      </div>
    </main>
  );
}

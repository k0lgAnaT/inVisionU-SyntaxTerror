'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [generatedPass, setGeneratedPass] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      // Mock generating a secure password for the commission member
      const pass = Math.random().toString(36).slice(-8) + 'U!';
      setGeneratedPass(pass);
      setSuccess(true);
      setLoading(false);
    }, 600);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/profile" className="text-sm font-semibold text-slate-500 hover:text-brand-600 mb-4 inline-block">← Назад в профиль</Link>
          <h1 className="text-3xl font-display font-bold text-slate-800">{t('prof_commission_panel')}</h1>
          <p className="text-slate-600 mt-2">Генерация учетных данных для членов приемной комиссии.</p>
        </div>

        <div className="glass-card-static p-8 max-w-lg">
          {success ? (
            <div className="animate-fade-in">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl mb-4">✓</div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Доступ предоставлен!</h2>
              <p className="text-sm text-slate-600 mb-6">Отправьте эти данные новому члену комиссии. После получения они смогут войти в систему как "Сотрудник".</p>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                <div className="mb-3">
                  <span className="text-xs text-slate-500 block">E-mail (Логин)</span>
                  <span className="font-mono font-semibold text-slate-800">{email}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Временный пароль</span>
                  <span className="font-mono font-semibold text-brand-600 text-lg">{generatedPass}</span>
                </div>
              </div>

              <button onClick={() => { setSuccess(false); setEmail(''); setGeneratedPass(''); }} className="btn-secondary w-full">
                Создать еще
              </button>
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Имя сотрудника</label>
                <input required type="text" className="input-field" placeholder="Алибек" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Корпоративный E-mail</label>
                <input 
                  required 
                  type="email" 
                  className="input-field" 
                  placeholder="alibek@invision-u.kz" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="bg-brand-50 text-brand-800 text-xs p-3 rounded-lg border border-brand-100 flex gap-2 items-start mt-4">
                <span className="text-lg">ℹ️</span>
                <span>Новый член комиссии получит доступ только к чтению анкет и возможности выставления своей независимой оценки. Администратор (вы) может отозвать доступ в любой момент.</span>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-4">
                {loading ? 'Генерация...' : t('prof_add_btn')}
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}

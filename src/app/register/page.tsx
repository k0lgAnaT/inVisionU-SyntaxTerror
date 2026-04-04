'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
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
    }, 1000);
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="glass-card-static max-w-md w-full p-8 text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-brand-400 text-black rounded-full flex items-center justify-center text-3xl mx-auto mb-6">✓</div>
          <h1 className="text-2xl font-display font-bold text-slate-800 mb-2">Аккаунт создан!</h1>
          <p className="text-slate-600 mb-6">Добро пожаловать в inVision U. Теперь вы можете войти в систему.</p>
          <Link href="/login" className="btn-primary w-full block py-3 text-center">
            Войти (Log In)
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
          <h1 className="text-2xl font-display font-bold text-slate-800 mb-1">Создать аккаунт</h1>
          <p className="text-xs text-slate-500">Регистрация для абитуриентов</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Имя (First name)</label>
              <input required type="text" className="input-field" placeholder="Айгерим" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Фамилия (Last name)</label>
              <input required type="text" className="input-field" placeholder="Казанбаева" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">E-mail (Почта)</label>
            <input required type="email" className="input-field" placeholder="applicant@invision-u.kz" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Пароль (Password)</label>
            <input required minLength={6} type="password" className="input-field" placeholder="••••••••" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Подтверждение пароля</label>
            <input required minLength={6} type="password" className="input-field" placeholder="••••••••" />
          </div>

          <div className="text-xs text-slate-500 mt-2 mb-6 text-center leading-relaxed">
            Создавая аккаунт, вы соглашаетесь с Политикой обработки персональных данных. (Safe & Secure Data)
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Создание...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Уже есть аккаунт? <Link href="/login" className="text-brand-600 font-semibold hover:underline">Войти</Link>
        </div>
      </div>
    </main>
  );
}

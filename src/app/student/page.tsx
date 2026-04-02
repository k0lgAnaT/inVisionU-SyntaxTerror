'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function StudentDashboard() {
  const [userName, setUserName] = useState('Студент');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }
    const savedStatus = localStorage.getItem('admissionStatus');
    if (savedStatus) {
      setStatus(savedStatus);
    }
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="map-bg"></div>

      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold text-slate-800 mb-4">Добрый день, {userName}! 👋</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Добро пожаловать в платформу отбора inVision U. Здесь вы можете пройти когнитивное тестирование и загрузить материалы для поступления.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Testing Card */}
        <div className="glass-card p-8 group cursor-pointer hover:-translate-y-1">
          <Link href="/student/test" className="absolute inset-0 z-20"></Link>
          <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
            🌍
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-brand-600 transition-colors">Начните свой тест</h2>
          <p className="text-slate-600 mb-6">
            Пройдите диагностическое тестирование для оценки вашего когнитивного и лидерского потенциала.
          </p>
          <div className="flex items-center text-brand-600 font-semibold gap-2">
            Пройти тест <span>→</span>
          </div>
        </div>

        {/* Admissions Card */}
        <div className="glass-card p-8 group cursor-pointer hover:-translate-y-1">
          <Link href="/student/admission" className="absolute inset-0 z-20"></Link>
          <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
            📝
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-brand-600 transition-colors">Поступление</h2>
          <p className="text-slate-600 mb-6">
            Загрузите свое мотивационное эссе, рекомендательные письма и расскажите о своих достижениях.
          </p>
          <div className="flex items-center text-brand-600 font-semibold gap-2">
            Загрузить документы <span>→</span>
          </div>
        </div>

      </div>

      <div className={`mt-12 p-8 rounded-2xl border ${
        status === 'invited' ? 'bg-emerald-50 border-emerald-200' :
        status === 'rejected' ? 'bg-red-50 border-red-200' :
        'glass-card-static'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Статус заявки</h3>
            <p className="text-slate-600 text-sm mt-1">
              {status === 'invited' ? 'Поздравляем! Ваша анкета прошла отбор. Мы приглашаем вас на видео-интервью с приемной комиссией.' :
               status === 'rejected' ? 'К сожалению, ваша анкета не прошла отбор на следующий этап. Желаем успехов в будущих начинаниях!' :
               'Ваша анкета находится на рассмотрении приемной комиссии после результата скоринга.'}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl font-semibold border whitespace-nowrap ${
            status === 'invited' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
            status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
            'bg-amber-100 text-amber-700 border-amber-200'
          }`}>
            {status === 'invited' ? 'Приглашен на интервью 🎉' :
             status === 'rejected' ? 'Новый этап не пройден' :
             'В обработке (In Review)'}
          </div>
        </div>
      </div>
    </main>
  );
}

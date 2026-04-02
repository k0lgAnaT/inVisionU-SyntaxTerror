'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StudentAdmissionPage() {
  const [submitted, setSubmitted] = useState(false);

  // Example candidate structure based on the figma
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="glass-card-static p-12 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-brand-400 text-black rounded-full flex items-center justify-center text-4xl mx-auto mb-6">📝</div>
          <h1 className="text-3xl font-display font-bold text-slate-800 mb-4">Материалы отправлены!</h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
            Ваше эссе и видео-визитка успешно загружены. Наш AI-ассистент и приёмная комиссия скоро приступят к их оценке.
          </p>
          <Link href="/student" className="btn-secondary px-8">
            Вернуться в личный кабинет
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      
      <div className="mb-8">
        <Link href="/student" className="text-sm font-semibold text-slate-500 hover:text-brand-600 mb-4 inline-block">← Назад в кабинет</Link>
        <h1 className="text-3xl font-display font-bold text-slate-800">Поступление</h1>
        <p className="text-slate-600 mt-2">Загрузите необходимые документы для отбора в inVision U.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="glass-card-static p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">1. Эссе / Мотивационное письмо</h2>
          <p className="text-sm text-slate-500 mb-4">Расскажите, почему вы хотите учиться у нас и какие проблемы хотите решить.</p>
          <textarea 
            required 
            rows={8} 
            className="input-field font-mono text-sm" 
            placeholder="Я хочу учиться в inVision U, потому что..."
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card-static p-6 flex flex-col items-center justify-center text-center border-dashed border-2 hover:border-brand-400 transition-colors cursor-pointer">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="font-semibold text-slate-800 mb-1">Резюме / CV</h3>
            <p className="text-xs text-slate-500 mb-4">PDF, DOCX (до 5 МБ)</p>
            <button type="button" className="btn-secondary text-sm">↑ Загрузить</button>
          </div>

          <div className="glass-card-static p-6 flex flex-col items-center justify-center text-center border-dashed border-2 hover:border-brand-400 transition-colors cursor-pointer">
            <div className="text-3xl mb-3">🎥</div>
            <h3 className="font-semibold text-slate-800 mb-1">Видео-визитка</h3>
            <p className="text-xs text-slate-500 mb-4">MP4, MOV (до 50 МБ)</p>
            <button type="button" className="btn-secondary text-sm">↑ Загрузить</button>
          </div>

          <div className="glass-card-static p-6 flex flex-col items-center justify-center text-center border-dashed border-2 hover:border-brand-400 transition-colors cursor-pointer">
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="font-semibold text-slate-800 mb-1">ЕНТ Сертификат</h3>
            <p className="text-xs text-slate-500 mb-4">Официальный сертификат (PDF/JPEG)</p>
            <button type="button" className="btn-secondary text-sm">↑ Загрузить</button>
          </div>

          <div className="glass-card-static p-6 flex flex-col items-center justify-center text-center border-dashed border-2 hover:border-brand-400 transition-colors cursor-pointer">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="font-semibold text-slate-800 mb-1">Другие документы</h3>
            <p className="text-xs text-slate-500 mb-4">IELTS, TOEFL, достижения (PDF)</p>
            <button type="button" className="btn-secondary text-sm">↑ Загрузить</button>
          </div>
        </div>

        <div className="glass-card-static p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">2. Дополнительные детали</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">GPA (если применимо)</label>
              <input type="number" step="0.1" className="input-field bg-slate-50" placeholder="4.0" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Ссылка на портфолио/GitHub</label>
              <input type="url" className="input-field bg-slate-50" placeholder="https://" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button type="submit" className="btn-primary w-full md:w-auto px-10 py-3 text-lg rounded-full shadow-lg">
            Подать заявку
          </button>
        </div>
      </form>

    </main>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function StudentDashboard() {
  const [userName, setUserName] = useState('Студент');
  const [status, setStatus] = useState('pending');
  const [testScore, setTestScore] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [interviewBooked, setInterviewBooked] = useState<string | null>(null);

  useEffect(() => {
    // 🛡️ AUTH GUARD
    const role = localStorage.getItem('userRole');
    if (!role) {
      window.location.href = '/login';
      return;
    }

    const savedName = localStorage.getItem('userName');
    if (savedName) setUserName(savedName);
    const savedStatus = localStorage.getItem('admissionStatus');
    if (savedStatus) setStatus(savedStatus);
    const savedTestScore = localStorage.getItem('testScore');
    if (savedTestScore) setTestScore(savedTestScore);
    const booked = localStorage.getItem('interviewBooked');
    if (booked) setInterviewBooked(booked);
  }, []);

  const resetDemo = () => {
    localStorage.removeItem('admissionStatus');
    localStorage.removeItem('testScore');
    localStorage.removeItem('interviewBooked');
    setStatus('pending');
    setTestScore(null);
    setInterviewBooked(null);
  };

  const handleBook = (time: string) => {
    localStorage.setItem('interviewBooked', time);
    setInterviewBooked(time);
    setShowCalendar(false);
  };

  const testScoreNum = testScore ? parseInt(testScore) : 0;
  const step1Done = !!testScore && testScoreNum >= 60;
  const step2Done = status === 'invited';
  const step3Done = !!interviewBooked;

  const steps = [
    {
      num: 1, label: 'Когнитивный тест', icon: '🧠',
      sublabel: step1Done ? `Сдан: ${testScore}%` : testScore ? `${testScore}% — нужно 60%+` : 'Минимум 60% для прохода',
      done: step1Done, failed: !!testScore && testScoreNum < 60,
    },
    {
      num: 2, label: 'Документы и эссе', icon: '📝',
      sublabel: step2Done ? 'Одобрено ИИ ✓' : status === 'rejected' ? 'Не одобрено' : 'Загрузите материалы',
      done: step2Done, failed: status === 'rejected',
    },
    {
      num: 3, label: 'Запись на интервью', icon: '🎤',
      sublabel: step3Done ? interviewBooked! : 'После прохода шагов 1 и 2',
      done: step3Done, failed: false,
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative min-h-[calc(100vh-64px)]">
      <div className="map-bg opacity-20 dark:opacity-10"></div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCalendar(false); }}
        >
          <div className="bg-white dark:bg-[#0f1225] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">📅 Запись на интервью</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Видео-звонок с комиссией · 30 мин</p>
              </div>
              <button onClick={() => setShowCalendar(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-3xl leading-none font-light w-8 h-8 flex items-center justify-center">×</button>
            </div>
            <div className="p-6 space-y-5">
              {[
                { label: 'Завтра', times: ['10:00', '11:30', '14:00', '16:45'] },
                { label: 'Послезавтра', times: ['09:00', '13:15', '15:30', '18:00'] },
              ].map(day => (
                <div key={day.label}>
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">📆 {day.label}</div>
                  <div className="grid grid-cols-4 gap-2">
                    {day.times.map(time => (
                      <button
                        key={`${day.label}-${time}`}
                        onClick={() => handleBook(`${day.label}, ${time}`)}
                        className="py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-white/10 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-700 dark:hover:text-brand-300 transition-all"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center pt-2 border-t border-slate-100 dark:border-white/5">
                Все слоты по времени Алматы (GMT+5) · Ссылка Zoom придёт на почту
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-10 flex items-start justify-between relative z-10">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-800 dark:text-white mb-2">Добрый день, {userName}! 👋</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl text-lg">
            Платформа отбора inVision U. Выполните все 3 шага для получения приглашения.
          </p>
        </div>
        <button onClick={resetDemo} title="Сбросить для нового демо" className="text-xs text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 underline underline-offset-2 mt-2">
          Сбросить
        </button>
      </div>

      {/* 3-Step Progress Tracker */}
      <div className="relative z-10 mb-8">
        <div className="flex gap-3">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex-1 flex items-center gap-2">
              <div className={`flex-1 p-5 rounded-2xl border-2 text-center transition-all ${
                step.done
                  ? 'bg-emerald-50 dark:bg-emerald-900/15 border-emerald-300 dark:border-emerald-600/50'
                  : step.failed
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-700/40'
                  : 'glass-card-static border-slate-200 dark:border-white/5'
              }`}>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl mx-auto mb-3 border-2 font-bold ${
                  step.done
                    ? 'bg-emerald-400 border-emerald-300 text-white'
                    : step.failed
                    ? 'bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-700/40'
                    : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'
                }`}>
                  {step.done ? '✓' : step.failed ? '✗' : step.icon}
                </div>
                <div className={`text-sm font-bold mb-1 ${
                  step.done ? 'text-emerald-700 dark:text-emerald-300'
                  : step.failed ? 'text-red-600 dark:text-red-400'
                  : 'text-slate-700 dark:text-slate-300'
                }`}>{step.label}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 leading-tight">{step.sublabel}</div>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-0.5 w-4 flex-shrink-0 rounded-full ${step.done ? 'bg-emerald-300' : 'bg-slate-200 dark:bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Cards — Шаги 1 и 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-6">

        {/* Test Card */}
        <div className={`glass-card p-7 group cursor-pointer hover:-translate-y-1 relative ${step1Done ? 'border-emerald-200 dark:border-emerald-700/40' : ''}`}>
          <Link href="/student/test" className="absolute inset-0 z-20"></Link>
          <div className="flex items-center justify-between mb-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform ${step1Done ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-brand-100 dark:bg-brand-900/40'}`}>
              {step1Done ? '✅' : '🧠'}
            </div>
            {testScore && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                step1Done
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700/50'
                  : 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/40'
              }`}>
                {testScore}% {step1Done ? '✓' : '— нужно 60%+'}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1.5">
            {step1Done ? 'Тест пройден' : 'Шаг 1: Когнитивный тест'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
            {step1Done
              ? `Ваш результат ${testScore}% засчитан. Можно пройти заново для улучшения балла.`
              : 'Адаптивный тест по вашей специальности. 60 секунд на каждый вопрос.'}
          </p>
          <span className="text-brand-600 dark:text-brand-400 font-semibold text-sm flex items-center gap-1">
            {step1Done ? 'Пройти заново' : 'Начать тест'} →
          </span>
        </div>

        {/* Admission Card */}
        <div className={`glass-card p-7 group relative transition-all ${!step1Done ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'} ${step2Done ? 'border-emerald-200 dark:border-emerald-700/40' : ''}`}>
          {step1Done && <Link href="/student/admission" className="absolute inset-0 z-20"></Link>}
          <div className="flex items-center justify-between mb-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform ${step1Done ? 'group-hover:scale-110' : ''} ${step2Done ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-brand-100 dark:bg-brand-900/40'}`}>
              {step2Done ? '✅' : !step1Done ? '🔒' : '📝'}
            </div>
            {!step1Done && (
              <span className="text-xs text-slate-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-full font-medium">
                Сначала тест
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1.5">
            {step2Done ? 'Документы приняты' : 'Шаг 2: Документы'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
            {step2Done
              ? 'ИИ одобрил вашу заявку. Переходите к записи на финальное интервью.'
              : 'Загрузите мотивационное эссе, ЕНТ-сертификат и Резюме/CV.'}
          </p>
          <span className="text-brand-600 dark:text-brand-400 font-semibold text-sm flex items-center gap-1">
            {step2Done ? 'Просмотреть заявку' : 'Подать документы'} →
          </span>
        </div>
      </div>

      {/* Step 3: Interview Booking */}
      {status === 'invited' && !interviewBooked && (
        <div className="relative z-10 p-7 rounded-2xl border-2 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-300 dark:border-emerald-600/50 animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-3xl border border-emerald-200 dark:border-emerald-700/50">
                🎉
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-white text-lg">Поздравляем! Вы прошли отбор</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Шаг 3:</span> Запишитесь на онлайн-интервью с приемной комиссией
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCalendar(true)}
              className="btn-primary whitespace-nowrap py-3 px-8 rounded-xl text-sm !bg-emerald-600 hover:!bg-emerald-700 !shadow-emerald-500/30"
            >
              📅 Выбрать время интервью
            </button>
          </div>
        </div>
      )}

      {/* Interview Booked State */}
      {status === 'invited' && interviewBooked && (
        <div className="relative z-10 p-7 rounded-2xl border-2 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-600/40 animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-3xl border border-blue-200 dark:border-blue-700/50">
                📹
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-white text-lg">Интервью назначено!</div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-base">{interviewBooked}</span>
                  <span className="text-slate-400 text-sm">· Zoom · 30 мин</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                  Ссылка и инструкции отправлены на email. Желаем успеха! 🚀
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 min-w-[180px]">
              <button className="py-3 px-6 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 text-center">
                🎥 Подключиться к Zoom
              </button>
              <button
                onClick={() => setShowCalendar(true)}
                className="py-2 px-6 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-slate-300 transition-colors text-center"
              >
                Перенести встречу
              </button>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-blue-200 dark:border-blue-800/30 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              🏆 Вы в числе лучших кандидатов inVision U! Приемная комиссия уже ознакомилась с вашим профилем.
            </p>
          </div>
        </div>
      )}

      {/* Rejected state */}
      {status === 'rejected' && (
        <div className="relative z-10 p-7 rounded-2xl border-2 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-700/40">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-2xl border border-red-200 dark:border-red-700/40">❌</div>
            <div>
              <div className="font-bold text-slate-800 dark:text-white">Заявка не прошла отбор</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {!step1Done ? 'Тест набрал менее 60%. Нужно пересдать!' : 'ИИ не смог одобрить материалы. Улучшите эссе и попробуйте снова.'}
              </div>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/student/test" className="text-sm font-semibold px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-brand-400 transition-colors">
              🔄 Пересдать тест
            </Link>
            <Link href="/student/admission" className="text-sm font-semibold px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-brand-400 transition-colors">
              📝 Обновить эссе
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

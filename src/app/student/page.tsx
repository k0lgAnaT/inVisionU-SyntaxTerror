'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function StudentDashboard() {
  const { t } = useLanguage();
  const [userName, setUserName] = useState('Applicant');
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
      num: 1, label: t('student_step_test'), icon: '🧠',
      sublabel: step1Done ? `Done: ${testScore}%` : testScore ? `${testScore}% — 60%+ required` : 'Min 60% to pass',
      done: step1Done, failed: !!testScore && testScoreNum < 60,
    },
    {
      num: 2, label: t('student_step_docs'), icon: '📝',
      sublabel: step2Done ? 'AI Approved ✓' : status === 'rejected' ? 'AI Rejected' : 'Upload materials',
      done: step2Done, failed: status === 'rejected',
    },
    {
      num: 3, label: t('student_step_result'), icon: '🎤',
      sublabel: step3Done ? interviewBooked! : 'After Step 1 & 2',
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
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">📅 {t('student_step_result')}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Video Call · 30 min</p>
              </div>
              <button onClick={() => setShowCalendar(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-3xl leading-none font-light w-8 h-8 flex items-center justify-center">×</button>
            </div>
            <div className="p-6 space-y-5">
              {[
                { label: 'Tomorrow', times: ['10:00', '11:30', '14:00', '16:45'] },
                { label: 'Day after', times: ['09:00', '13:15', '15:30', '18:00'] },
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
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center pt-2 border-t border-slate-100 dark:border-white/5">
                GMT+5 (Almaty Time) · Zoom link via Email
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-10 flex items-start justify-between relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-white mb-2">Hello, {userName}! 👋</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl text-lg">
            {t('student_wait_desc')}
          </p>
        </div>
        <button onClick={resetDemo} className="text-xs text-slate-400 underline mt-2">
          Reset
        </button>
      </div>

      {/* 3-Step Progress Tracker */}
      <div className="relative z-10 mb-10">
        <div className="flex flex-col md:flex-row gap-4 md:gap-3">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex flex-col md:flex-row flex-1 items-center gap-2">
              <div className={`w-full md:flex-1 p-5 rounded-2xl border-2 text-center transition-all ${
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
                <div className={`hidden md:block h-0.5 w-4 flex-shrink-0 rounded-full ${step.done ? 'bg-emerald-300' : 'bg-slate-200 dark:bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-6">
        <div className={`glass-card p-7 group cursor-pointer hover:-translate-y-1 relative ${step1Done ? 'border-emerald-200 dark:border-emerald-700/40' : ''}`}>
          <Link href="/student/test" className="absolute inset-0 z-20"></Link>
          <div className="flex items-center justify-between mb-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform ${step1Done ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-brand-100 dark:bg-brand-900/40'}`}>
              {step1Done ? '✅' : '🧠'}
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1.5">
            {t('student_step_test')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
             60 seconds per question. Adaptive algorithm.
          </p>
          <span className="text-brand-600 dark:text-brand-400 font-semibold text-sm">
            {step1Done ? 'Retake' : 'Start'} →
          </span>
        </div>

        <div className={`glass-card p-7 group relative transition-all ${!step1Done ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'} ${step2Done ? 'border-emerald-200 dark:border-emerald-700/40' : ''}`}>
          {step1Done && <Link href="/student/admission" className="absolute inset-0 z-20"></Link>}
          <div className="flex items-center justify-between mb-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform ${step1Done ? 'group-hover:scale-110' : ''} ${step2Done ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-brand-100 dark:bg-brand-900/40'}`}>
              {step2Done ? '✅' : !step1Done ? '🔒' : '📝'}
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1.5">
            {t('student_step_docs')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
            {step2Done ? 'Approved' : 'Upload essay and CV.'}
          </p>
          <span className="text-brand-600 dark:text-brand-400 font-semibold text-sm">
            {step2Done ? 'View' : 'Upload'} →
          </span>
        </div>
      </div>

      {status === 'invited' && !interviewBooked && (
        <div className="relative z-10 p-7 rounded-2xl border-2 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-300 dark:border-emerald-600/50 animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-3xl">🎉</div>
              <div>
                <div className="font-bold text-slate-800 dark:text-white text-lg">Shortlisted!</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Step 3: Book your interview with the committee.</div>
              </div>
            </div>
            <button onClick={() => setShowCalendar(true)} className="btn-primary py-3 px-8 !bg-emerald-600">
               Book Interview
            </button>
          </div>
        </div>
      )}

      {status === 'invited' && interviewBooked && (
        <div className="relative z-10 p-7 rounded-2xl border-2 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-600/40 animate-fade-in-up text-center">
            <div className="font-bold text-slate-800 dark:text-white text-lg">Interview set for {interviewBooked}</div>
            <p className="text-sm text-slate-500 mt-2">Check your email for details. Good luck! 🚀</p>
        </div>
      )}
    </main>
  );
}

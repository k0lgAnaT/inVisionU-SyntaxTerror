'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getRandomQuestions, TestQuestion } from '@/data/testQuestions';

type Step = 'intro' | 'select_program' | 'test' | 'results';

export default function StudentTestPage() {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState<Step>('intro');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answers, setAnswers] = useState<number[]>([]);

  // Programs mapping
  const programsList = [
    { id: 'creative-engineering', label: 'Creative Engineering / Креативная Инженерия' },
    { id: 'it-product-design', label: 'Innovative IT Product Design' },
    { id: 'sociology-leadership', label: 'Sociology: Leadership and Innovation' },
    { id: 'public-policy', label: 'Public Policy and Development' },
    { id: 'digital-media', label: 'Digital Media and Marketing' },
    { id: 'foundation', label: 'Foundation Year / Подготовительный Год' }
  ];

  const handleStartSelection = () => setStep('select_program');

  const startTest = (programId: string) => {
    setSelectedProgram(programId);
    const qs = getRandomQuestions(programId, 5); // Using 5 questions for demo
    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(60);
    setStep('test');
  };

  useEffect(() => {
    if (step === 'test' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 'test' && timeLeft === 0) {
      handleAnswer(-1); // Time out
    }
  }, [timeLeft, step]);

  const handleAnswer = (index: number) => {
    const q = questions[currentIndex];
    if (index === q.correctIndex) {
      setScore(s => s + 1);
    }
    setAnswers([...answers, index]);
    
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(c => c + 1);
      setTimeLeft(60);
    } else {
      setStep('results');
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Base map layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
          alt="World Map" 
          className="w-full max-w-5xl"
          style={{ filter: 'hue-rotate(60deg) brightness(1.2)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {step === 'intro' && (
          <div className="text-center bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white/50 animate-fade-in-up">
            <h1 className="text-4xl font-display font-black text-slate-800 mb-6 tracking-tight">Вступительный тест</h1>
            <p className="text-slate-600 mb-8 text-lg">
              Тестирование адаптируется под выбранную специальность. Ограничение по времени — 60 секунд на вопрос.
            </p>
            <button 
              onClick={handleStartSelection}
              className="px-10 py-4 rounded-full font-bold bg-brand-400 text-black hover:scale-105 shadow-md transition-transform"
            >
              Начать тест
            </button>
          </div>
        )}

        {step === 'select_program' && (
          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white/50 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Выберите вашу программу</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programsList.map(p => (
                <button
                  key={p.id}
                  onClick={() => startTest(p.id)}
                  className="p-5 text-left border-2 border-slate-200 rounded-2xl hover:border-brand-400 hover:bg-brand-50 transition-colors"
                >
                  <span className="font-semibold text-slate-800 block mb-1">{p.label}</span>
                  <span className="text-xs text-slate-500">20 вопросов • 20 минут всего</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'test' && questions.length > 0 && (
          <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div className="text-brand-600 font-bold">Вопрос {currentIndex + 1} / {questions.length}</div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Осталось:</span>
                <span className={`font-mono font-bold text-lg px-3 py-1 rounded-lg ${timeLeft <= 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
                  00:{timeLeft.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 block">
                {questions[currentIndex].category}
              </span>
              <h3 className="text-2xl font-semibold text-slate-800 leading-snug">
                {questions[currentIndex].question[lang as 'ru' | 'en' | 'kz'] || questions[currentIndex].question['ru']}
              </h3>
            </div>

            <div className="space-y-3">
              {(questions[currentIndex].options[lang as 'ru' | 'en' | 'kz'] || questions[currentIndex].options['ru']).map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-brand-400 hover:bg-brand-50 active:bg-brand-100 transition-colors text-slate-700 font-medium"
                >
                  {opt}
                </button>
              ))}
            </div>
            
            {/* Progress bar */}
            <div className="mt-8 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-400 transition-all duration-300"
                style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {step === 'results' && (
          <div className="text-center bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white/50 animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-brand-100 border-4 border-white shadow-lg mx-auto flex items-center justify-center text-4xl mb-6">
              🎉
            </div>
            <h2 className="text-3xl font-display font-black text-slate-800 mb-2">Тест завершён!</h2>
            <p className="text-slate-500 mb-8">Ваш результат сохранен в профиле</p>
            
            <div className="glass-card-static bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-200 mx-auto max-w-sm">
              <div className="text-5xl font-mono font-bold text-brand-600 mb-2">
                {Math.round((score / questions.length) * 100)}%
              </div>
              <div className="text-slate-600 font-medium">Правильных ответов: {score} из {questions.length}</div>
            </div>

            <div className="space-y-4 max-w-md mx-auto mb-8 border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-left mb-4">Анализ ответов</h3>
              {questions.map((q, i) => {
                const isCorrect = answers[i] === q.correctIndex;
                return (
                  <div key={i} className={`p-4 rounded-xl text-left border ${isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <div className="flex gap-3">
                      <div className="mt-0.5">{isCorrect ? '✅' : '❌'}</div>
                      <div>
                        <div className="text-xs font-semibold mb-1 text-slate-800">{q.category}</div>
                        <div className="text-sm text-slate-600 mb-2">{q.question[lang as 'ru' | 'en' | 'kz'] || q.question['ru']}</div>
                        {!isCorrect && <div className="text-xs text-brand-600 font-medium">Пояснение: {q.explanation[lang as 'ru' | 'en' | 'kz'] || q.explanation['ru']}</div>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <button 
              onClick={() => window.location.href = '/student'}
              className="px-10 py-3 rounded-full font-bold bg-slate-800 text-white hover:bg-slate-900 transition-colors"
            >
              Вернуться в дашборд
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

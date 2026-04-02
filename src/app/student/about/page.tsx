import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="w-48 h-16 bg-brand-400 text-slate-900 mx-auto rounded-2xl flex items-center justify-center font-display font-black text-3xl mb-8 shadow-sm">
          inDrive
        </div>
        <h1 className="text-4xl font-display font-bold text-slate-800 mb-6 max-w-2xl mx-auto leading-tight">
          Международная компания inDrive борется с неравным распределением возможностей в мире.
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Мы хотим сделать мир более справедливым для одного миллиарда человек.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card-static p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">inVision U</h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Инновационный университет для тех, кто хочет менять мир. 100% гранты на обучение от inDrive для самых мотивированных и амбициозных талантов.
          </p>
          <ul className="space-y-3 mt-6">
            <li className="flex items-center gap-3 font-medium text-slate-700">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm">✓</span>
              Лидерство
            </li>
            <li className="flex items-center gap-3 font-medium text-slate-700">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm">✓</span>
              Справедливость
            </li>
            <li className="flex items-center gap-3 font-medium text-slate-700">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm">✓</span>
              Влияние на общество
            </li>
          </ul>
        </div>
        
        <div className="glass-card-static p-8 bg-slate-800 text-white border-none">
          <h2 className="text-2xl font-bold mb-4">AI Admissions</h2>
          <p className="text-slate-300 mb-4 leading-relaxed">
            Наша система отбора использует искусственный интеллект, чтобы минимизировать человеческую предвзятость и оценивать ваш реальный потенциал, а не только идеальные оценки.
          </p>
          <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="text-sm font-semibold uppercase tracking-wider text-brand-400 mb-2">Наш подход</div>
            Мы ищем «агентов изменений». Людей с высокой мотивацией и крутой траекторией роста.
          </div>
        </div>
      </div>
    </main>
  );
}

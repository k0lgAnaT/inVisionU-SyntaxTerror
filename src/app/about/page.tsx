'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';

const PIPELINE_STEPS = [
  {
    step: '01',
    icon: '📄',
    title: 'Данные кандидата',
    desc: 'Принимаем: эссе, GPA, опыт, достижения, языки, видео-заявку, рекомендации. Без расовых, гендерных или социально-экономических маркеров.',
    color: '#3b5cff',
  },
  {
    step: '02',
    icon: '🔬',
    title: 'NLP-Анализ эссе',
    desc: 'Flesch readability, лексическая насыщенность (RTTR), keyword density (EN+RU), анализ дисперсии длины предложений (AI detection).',
    color: '#7c3aed',
  },
  {
    step: '03',
    icon: '⚖️',
    title: 'Многомерный скоринг',
    desc: '5 измерений: Лидерство, Мотивация, Рост, Коммуникация, Growth Velocity. Каждый балл имеет текстовое объяснение (XAI).',
    color: '#0891b2',
  },
  {
    step: '04',
    icon: '🎭',
    title: 'Blind Review (Fairness)',
    desc: 'Имена, возраст и город скрываются по запросу. ИИ не принимает финальных решений — комиссия голосует и добавляет заметки.',
    color: '#059669',
  },
  {
    step: '05',
    icon: '📊',
    title: 'Ранжирование + рекомендация',
    desc: 'Кандидаты выстраиваются в рейтинг. Комиссия выбирает профиль весов (Balanced / Leadership / Authenticity / Growth).',
    color: '#d97706',
  },
  {
    step: '06',
    icon: '🤝',
    title: 'Human-in-the-loop',
    desc: 'Финальное решение принимает живой человек. ИИ — это инструмент поддержки, а не чёрный ящик.',
    color: '#e11d48',
  },
];

const DIMENSIONS = [
  {
    key: 'leadership',
    label: 'Лидерство',
    icon: '👑',
    desc: 'Детектирует лидерские ключевые слова (EN+RU), анализирует опыт руководства и организации, оценивает конкретные результаты.',
    signals: ['leadership keywords density', 'team/founder mentions', 'scale & results evidence'],
  },
  {
    key: 'motivation',
    label: 'Мотивация',
    icon: '🔥',
    desc: 'Оценивает специфичность целей, упоминание inVision U, качество аргументации "почему именно здесь".',
    signals: ['goal specificity', 'university mention', 'passion signals density'],
  },
  {
    key: 'growth',
    label: 'Потенциал роста',
    icon: '📈',
    desc: 'Анализирует траекторию: опыт относительно возраста, упоминание провалов и их переосмысления, готовность учиться.',
    signals: ['experience count per age', 'failure/learning signals', 'resilience keywords'],
  },
  {
    key: 'communication',
    label: 'Коммуникация',
    icon: '💬',
    desc: 'Читаемость текста (Flesch), богатство словаря (RTTR), структурированность аргументов, многоязычность.',
    signals: ['Flesch reading ease', 'vocabulary richness (RTTR)', 'multilingual bonus'],
  },
  {
    key: 'growthVelocity',
    label: 'Growth Velocity',
    icon: '⚡',
    desc: 'Уникальная метрика: скорость роста кандидата относительно возраста. Молодой с большим опытом — сильный сигнал.',
    signals: ['experience count / age ratio', 'achievement count', 'innovation project bonus'],
  },
];

const ETHICAL_PRINCIPLES = [
  { icon: '🚫', title: 'Нет "чёрных ящиков"', desc: 'Детерминированные алгоритмы. Каждый балл объяснён.' },
  { icon: '👁️', title: 'No racial / socio-economic data', desc: 'Никаких демографических маркеров в скоринге.' },
  { icon: '🤝', title: 'Human-in-the-loop', desc: 'Комиссия принимает финальное решение. ИИ — советник.' },
  { icon: '🎭', title: 'Blind Review доступен', desc: 'Скрытие имён и города для fairness.' },
  { icon: '🔒', title: 'Privacy First', desc: 'Данные не передаются в открытые LLM. Обработка локальная.' },
  { icon: '⚠️', title: 'AI Detection — не блокировка', desc: 'Высокий AI Risk ставит флаг, но NOT автоматически отклоняет.' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Hero */}
          <div className="py-12 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800/50">
                Decentrathon 5.0 · AI inDrive Track
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-800 dark:text-white mb-4 leading-tight">
              Как работает <span className="gradient-text">inVision U AI</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Прозрачная, объяснимая система поддержки приёмной комиссии.
              ИИ анализирует — человек решает. Никаких «чёрных ящиков».
            </p>
            <div className="flex gap-3 mt-6">
              <Link href="/" className="btn-primary">Dashboard комиссии →</Link>
              <Link href="/validation" className="btn-secondary">Отчёт валидации →</Link>
            </div>
          </div>

          {/* Mission & Partnership - New from site */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 animate-fade-in-up">
            <div className="glass-card-static p-6 border-l-4 border-brand-400">
              <h2 className="text-xl font-display font-bold text-slate-800 dark:text-white mb-3">🌟 Миссия inVision U</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                “Подготовка будущих лидеров, предпринимателей и создателей проектов, 
                способных принести мощные позитивные изменения в свою родину и мир 
                через проектное обучение и критическое мышление.”
              </p>
            </div>
            <div className="glass-card-static p-6 border-l-4 border-blue-500">
              <h2 className="text-xl font-display font-bold text-slate-800 dark:text-white mb-3">🤝 Партнерство с Satbayev University</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                inVision U является автономным инновационным факультетом в структуре 
                Satbayev University, со своей уникальной учебной программой и 
                полными грантами для студентов.
              </p>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="glass-card-static p-8 mb-10 animate-fade-in-up">
            <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-4">🎯 Проблема, которую мы решаем</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-3">Боли приёмной комиссии</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  {[
                    'Таланты с низким умением "продать себя" теряются при ручном скрининге',
                    'Генеративный ИИ размывает подлинный голос кандидата в эссе',
                    'При росте потока кандидатов качество ручного отбора падает',
                    'Предвзятость: сильные кандидаты без "правильных" школ отсеиваются',
                  ].map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-3">Наше решение</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  {[
                    'NLP-анализ выявляет сигналы потенциала, невидимые при ручной проверке',
                    'AI Heatmap визуализирует подозрительные паттерны в эссе',
                    'Ранжирует 100+ кандидатов за секунды с объяснением каждого балла',
                    'Blind Mode скрывает имена — оцениваем только merit',
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Pipeline */}
          <div className="mb-10">
            <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-6 animate-fade-in-up">🔄 Процесс оценки (Pipeline)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PIPELINE_STEPS.map((s, i) => (
                <div key={s.step} className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                      {s.icon}
                    </div>
                    <div>
                      <div className="text-xs font-mono text-slate-400">Шаг {s.step}</div>
                      <div className="font-bold text-sm text-slate-800 dark:text-white">{s.title}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring Dimensions */}
          <div className="mb-10">
            <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-2 animate-fade-in-up">📐 5 Измерений оценки (XAI)</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              Каждый балл сопровождается объяснением. Нажмите на измерение в профиле кандидата, чтобы увидеть причину оценки.
            </p>
            <div className="space-y-4">
              {DIMENSIONS.map((d, i) => (
                <div key={d.key} className="glass-card-static p-5 flex flex-col md:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-center gap-3 md:w-48 flex-shrink-0">
                    <div className="text-2xl">{d.icon}</div>
                    <div className="font-bold text-slate-800 dark:text-white text-sm">{d.label}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{d.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {d.signals.map(sig => (
                        <span key={sig} className="text-xs px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-800/30 font-mono">
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admission Criteria - New from site */}
          <div className="glass-card-static p-8 mb-10 animate-fade-in-up">
            <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-4">📝 Критерии отбора</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 font-medium">
              Мы ищем кандидатов, которые демонстрируют:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Мотивация', desc: 'Сильное желание изменить мир к лучшему' },
                { title: 'Лидерство', desc: 'Опыт организации команд или проектов' },
                { title: 'Ценности', desc: 'Соответствие этическим принципам университета' },
                { title: 'Потенциал', desc: 'Способность к быстрому росту и обучению' }
              ].map(c => (
                <div key={c.title} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-800 dark:text-white mb-1 text-sm">{c.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Programs FAQ - New from site */}
          <div className="mb-10">
            <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-6 animate-fade-in-up">❓ Часто задаваемые вопросы</h2>
            <div className="space-y-3">
              {[
                { q: 'Что такое Foundation Year?', a: 'Это подготовительный год для развития навыков английского языка, математики и цифровой грамотности перед бакалавриатом.' },
                { q: 'Требуется ли оплата за обучение?', a: 'inVision U предоставляет 100% гранты на обучение. Также доступны стипендии на проживание и питание.' },
                { q: 'На каком языке ведется обучение?', a: 'Основной язык обучения — английский.' }
              ].map((f, i) => (
                <div key={i} className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="font-bold text-slate-800 dark:text-white mb-2 text-sm">Q: {f.q}</div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">A: {f.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ethical Principles */}
          <div className="mb-10">
            <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-6 animate-fade-in-up">🔒 Этика и ограничения (Fairness)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ETHICAL_PRINCIPLES.map((p, i) => (
                <div key={i} className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <div className="font-bold text-sm text-slate-800 dark:text-white mb-1">{p.title}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Leadership / Advisory - New from site */}
          <div className="mb-10 animate-fade-in-up">
            <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-6">👥 Лидерство и Консультативный совет</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: 'Arsen Tomsky', role: 'Founder, CEO of inDrive' },
                { name: 'Andrew Wachtel', role: 'President of inVision U' },
                { name: 'Anel Kulakhmetova', role: 'Provost' },
                { name: 'Nurken Aubakir', role: 'Director of Foundation' },
                { name: 'Zehra Sayers', role: 'Structural Biologist' },
                { name: 'Ahmet Evin', role: 'Jean Monnet Professor' },
                { name: 'Daria Kozlova', role: 'First Vice Rector, ITMO' },
                { name: 'Peter Sloot', role: 'Professor, Complexity Science' }
              ].map((m, i) => (
                <div key={m.name} className="glass-card p-4 hover:scale-[1.02] transition-transform">
                  <div className="font-bold text-sm text-slate-800 dark:text-white mb-1">{m.name}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">{m.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Links */}
          <div className="glass-card-static p-8 animate-fade-in-up">
            <h2 className="text-xl font-display font-bold text-slate-800 dark:text-white mb-6">🗺️ Функции платформы</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { href: '/', icon: '◈', title: 'Dashboard комиссии', desc: 'Рейтинг кандидатов, статистика, blind mode' },
                { href: '/leaderboard', icon: '⬡', title: 'Лидерборд', desc: 'Сортировка, фильтры, профили весов (Balanced / Leadership / Growth)' },
                { href: '/candidates/cand-1', icon: '👤', title: 'Профиль кандидата', desc: 'XAI объяснения, AI heatmap, умные вопросы, вердикт комиссии' },
                { href: '/validation', icon: '📊', title: 'Отчёт валидации', desc: 'Spearman ρ, сравнение с baseline, edge cases' },
                { href: '/submit', icon: '⚡', title: 'Live Scoring Demo', desc: 'Введите эссе — получите балл в реальном времени' },
                { href: '/student', icon: '🎓', title: 'Портал студента', desc: 'Когнитивный тест, загрузка документов, статус заявки' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="glass-card p-4 hover:-translate-y-1 transition-all group">
                  <div className="text-xl mb-2 group-hover:scale-110 transition-transform">{link.icon}</div>
                  <div className="font-semibold text-sm text-slate-800 dark:text-white mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{link.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{link.desc}</div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

import Link from 'next/link';

const programs = [
  {
    tag: 'Engineering',
    name: 'Creative Engineering',
    nameRu: 'Креативная Инженерия',
    description: 'This program is for those who want to be at the forefront of technological innovation. From day one, students solve real engineering challenges, create prototypes, and build digital products. The curriculum integrates technology, design, and project management, helping students become leaders capable of turning ideas into practical solutions.',
    descriptionRu: 'Программа для тех, кто хочет быть в авангарде технологических инноваций. С первого дня студенты решают реальные инженерные задачи, создают прототипы и разрабатывают цифровые продукты. Учебная программа объединяет технологии, дизайн и управление проектами.',
    ent: 'Математика + Физика',
    color: '#3b82f6',
  },
  {
    tag: 'Technology',
    name: 'Innovative IT Product Design and Development',
    nameRu: 'Инновационный Дизайн и Разработка ИТ-Продуктов',
    description: 'This program teaches students how to transform ideas into digital products that truly meet people\'s needs. Students learn to design intuitive interfaces, build data- and technology-driven solutions, and study UX/UI, product management, and the fundamentals of marketing.',
    descriptionRu: 'Программа учит студентов преобразовывать идеи в цифровые продукты, которые действительно отвечают потребностям людей. Студенты изучают UX/UI, управление продуктами и основы маркетинга.',
    ent: 'Математика + Информатика',
    color: '#8b5cf6',
  },
  {
    tag: 'Society',
    name: 'Sociology: Leadership and Innovation',
    nameRu: 'Социология: Лидерство и Инновации',
    description: 'This track is for those eager to understand people — their stories, traditions, and ways of living together. Students explore how values are formed, how communities adapt to change, and how culture shapes worldviews. Through hands-on research and data analysis, they learn to identify patterns that unite societies.',
    descriptionRu: 'Курс для тех, кто стремится понять людей — их истории, традиции и образ жизни. Студенты изучают, как формируются ценности, как сообщества адаптируются к изменениям и как культура формирует мировоззрение.',
    ent: 'Математика + География',
    color: '#06b6d4',
  },
  {
    tag: 'Policy & Reform',
    name: 'Public Policy and Development',
    nameRu: 'Государственная Политика и Развитие',
    description: 'Designed for students who want to influence how cities and regions evolve and contribute to fair, sustainable policymaking. Students study data analysis methods, economic systems, and strategy design for improving quality of life. The program prepares graduates to work with governments, NGOs, and communities.',
    descriptionRu: 'Программа для студентов, желающих влиять на развитие городов и регионов и вносить вклад в справедливую и устойчивую политику. Студенты изучают методы анализа данных, экономические системы и разработку стратегий.',
    ent: 'Математика + География',
    color: '#f59e0b',
  },
  {
    tag: 'Arts + Media',
    name: 'Digital Media and Marketing',
    nameRu: 'Цифровые Медиа и Маркетинг',
    description: 'The program trains communication specialists with skills in journalism, media production, PR, and marketing. Students learn storytelling, writing and editing, video and podcast production, and gain a solid understanding of how media works. A special focus on critical thinking, analytics, and effective communication.',
    descriptionRu: 'Программа готовит специалистов по коммуникациям с навыками в журналистике, PR и маркетинге. Студенты изучают сторителлинг, видео и подкаст продакшн, с фокусом на критическое мышление и аналитику.',
    ent: 'История КЗ + Грамотность чтения + 2 творческих экзамена',
    color: '#ec4899',
  },
];

export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-20 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-6 tracking-tight">
          Программы inVision U
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium">
          Инновационное образование, оказывающее реальное влияние на мир.
        </p>
      </div>

      {/* Header Banner */}
      <div className="mb-20 glass-card-static bg-slate-800 text-white rounded-3xl overflow-hidden relative" style={{ animationDelay: '0.1s' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-transparent"></div>
        <div className="p-10 md:p-14 relative z-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-brand-400 font-bold text-xl mb-4 font-mono">01</div>
            <p className="text-lg md:text-xl leading-relaxed text-slate-200">
              Программа бакалавриата inVision U сочетает глубокие академические знания с практическим применением. Мы развиваем лидерские качества, ответственность, критическое осмысление и целенаправленные действия. Наша учебная программа основана на ценностях осознанности и справедливости.
            </p>
          </div>
          <div className="md:border-l border-white/20 md:pl-10">
            <div className="text-brand-400 font-bold text-xl mb-4 font-mono">02</div>
            <p className="text-lg md:text-xl leading-relaxed text-slate-200 mb-6">
              На четвертом курсе каждый студент работает над реальным проектом и может подать заявку на грант для его реализации.
            </p>
            <div className="inline-block bg-brand-400 text-black font-bold px-6 py-3 rounded-full">
              Все студенты обучаются по стипендии от inDrive
            </div>
          </div>
        </div>
      </div>

      {/* Programs Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">Программы бакалавриата</h2>
        <p className="text-slate-500 text-sm mb-1">5 направлений · Обучение на английском · 4 года · Государственный диплом</p>
        <div className="h-1 w-20 bg-brand-400 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((prog, i) => (
          <div key={i} className="glass-card-static p-8 hover:-translate-y-2 transition-transform duration-300 flex flex-col">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">{prog.tag}</span>
              <h3 className="text-xl font-bold text-slate-800 leading-tight mb-1">{prog.name}</h3>
              <p className="text-sm text-brand-600 font-medium">{prog.nameRu}</p>
            </div>
            <p className="text-slate-600 mb-6 flex-grow leading-relaxed text-sm">
              {prog.descriptionRu}
            </p>
            <div className="mt-auto space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full" style={{ background: prog.color }}></span>
                ЕНТ: {prog.ent}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Foundation Year Section */}
      <div className="mt-20 mb-12">
        <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">Foundation Year</h2>
        <p className="text-slate-500 text-sm mb-1">Подготовительный год · 1 год · Стипендия + проживание + питание</p>
        <div className="h-1 w-20 bg-brand-400 rounded-full"></div>
      </div>

      <div className="glass-card-static p-8 md:p-10 mb-16">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Год, который всё меняет</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Foundation Year в inVision U — это стипендиальная одногодичная программа для талантливых выпускников школ из сельских районов и малых городов. Программа помогает раскрыть потенциал, подготовиться к университету и развить уверенность, самостоятельность и целеустремленность.
            </p>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-xs">EN</span>
                Английский язык — до upper-intermediate и выше
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-xs">🧠</span>
                Критическое мышление, математика, логика, ИТ
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-xs">🎓</span>
                Приоритетное зачисление на бакалавриат
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Что получают студенты</h3>
            <div className="space-y-3">
              {[
                'Стипендиальное обучение — 100% грант от inDrive',
                'Бесплатное проживание в общежитии',
                'Трёхразовое питание',
                'Оплаченный проезд до Алматы и обратно',
                'Ежемесячная стипендия',
                'Занятия по йоге, лидерству и благополучию',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="text-brand-500">✓</span>
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-brand-50 border border-brand-100">
              <p className="text-sm text-slate-700 font-medium">
                📍 Кампус Satbayev University, ул. Каныша Сатпаева 22/1, Алматы
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Набор: 30-35 студентов ежегодно · Дедлайн: 30 мая 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admission Requirements Section */}
      <div className="mt-24 mb-12">
        <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">Требования к поступлению (Бакалавриат)</h2>
        <div className="h-1 w-20 bg-brand-400 rounded-full mb-12"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Column 1 */}
          <div>
            <div className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 font-mono text-lg mb-6">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              ЕНТ: 80 баллов (для граждан <br className="hidden lg:block"/> Казахстана) по одной из комбинаций:
            </h3>
            <ul className="space-y-4 text-sm text-slate-600 list-disc pl-5">
              <li><strong className="text-slate-800 font-semibold">Математика + География</strong> – Социология: Лидерство и инновации, Государственная политика и развитие</li>
              <li><strong className="text-slate-800 font-semibold">Математика + Информатика</strong> – Инновационный дизайн и разработка ИТ-продуктов</li>
              <li><strong className="text-slate-800 font-semibold">Математика + Физика</strong> – Креативная инженерия</li>
              <li><strong className="text-slate-800 font-semibold">История Казахстана + Грамотность чтения + 2 творческих экзамена</strong> – Цифровые медиа и маркетинг</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <div className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 font-mono text-lg mb-6">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Уровень владения английским языком:
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              IELTS 6.0 / TOEFL iBT 60–78 / Duolingo 105–115 (для иностранных абитуриентов, не имеющих возможности сдавать IELTS или TOEFL)
            </p>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500">
              <strong className="text-slate-700">Сроки подачи:</strong><br/>
              Ранний приём: до 24 декабря 2025<br/>
              Основной приём: 12 марта — 30 мая 2026
            </div>
          </div>

          {/* Column 3 */}
          <div>
            <div className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 font-mono text-lg mb-6">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Необходимые документы:
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 list-disc pl-5">
              <li>Удостоверение личности или паспорт</li>
              <li>Ссылка на видеопрезентацию (мотивационное видео)</li>
              <li>Сертификат ЕНТ (для граждан Казахстана)</li>
              <li>Сертификат о владении английским языком</li>
            </ul>
            <div className="mt-6 p-3 rounded-lg bg-brand-50 border border-brand-100 text-xs text-slate-600">
              <strong className="text-brand-700">Страны приёма:</strong> Казахстан, Кыргызстан, Узбекистан, Таджикистан, Туркменистан
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

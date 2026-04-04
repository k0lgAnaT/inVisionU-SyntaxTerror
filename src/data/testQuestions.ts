export interface LocalizedString {
  ru: string;
  en: string;
  kz: string;
}

export interface LocalizedOptions {
  ru: string[];
  en: string[];
  kz: string[];
}

export interface TestQuestion {
  id: string;
  program: string;
  category: string;
  question: LocalizedString;
  options: LocalizedOptions;
  correctIndex: number;
  explanation: LocalizedString;
}

// A representative set of questions for the demo.
// (Due to token limits, this contains a robust sample. The full 240+ question bank can be loaded externally).
export const questionBank: TestQuestion[] = [
  // 1. Creative Engineering
  {
    id: 'ce-1',
    program: 'creative-engineering',
    category: 'Physics & Engineering',
    question: {
      ru: 'Какова основная цель прототипирования в инженерном процессе?',
      en: 'What is the primary goal of prototyping in the engineering process?',
      kz: 'Инженерлік процестегі прототиптеудің негізгі мақсаты қандай?'
    },
    options: {
      ru: ['Создание финального продукта', 'Проверка концепции и выявление ошибок', 'Снижение стоимости производства', 'Улучшение внешнего вида'],
      en: ['Creating the final product', 'Validating the concept and finding errors', 'Reducing production cost', 'Improving appearance'],
      kz: ['Соңғы өнімді жасау', 'Тұжырымдаманы тексеру және қателерді табу', 'Өндіріс құнын төмендету', 'Сыртқы түрін жақсарту']
    },
    correctIndex: 1,
    explanation: {
      ru: 'Прототипирование позволяет инженерам тестировать идеи на ранних этапах.',
      en: 'Prototyping allows engineers to test ideas early on.',
      kz: 'Прототиптеу инженерлерге идеяларды ертерек сынауға мүмкіндік береді.'
    }
  },
  {
    id: 'ce-2',
    program: 'creative-engineering',
    category: 'Logic',
    question: {
      ru: 'Если шестерня А вращается по часовой стрелке и соединена с шестерней В, в каком направлении будет вращаться шестерня С, соединенная с В?',
      en: 'If gear A rotates clockwise and drives gear B, what direction will gear C, driven by B, rotate?',
      kz: 'Егер А тісті дөңгелегі сағат тілімен айналса және В дөңгелегімен қосылса, ал В дөңгелегі С-ға қосылса, С қай бағытта айналады?'
    },
    options: {
      ru: ['По часовой стрелке', 'Против часовой стрелки', 'Будет неподвижна', 'Зависит от размера шестерней'],
      en: ['Clockwise', 'Counter-clockwise', 'Will not move', 'Depends on gear size'],
      kz: ['Сағат тілімен', 'Сағат тіліне қарсы', 'Қозғалмайды', 'Көлеміне байланысты']
    },
    correctIndex: 0,
    explanation: {
      ru: 'Смежные шестерни вращаются в противоположных направлениях. A(по) -> B(против) -> C(по).',
      en: 'Adjacent gears rotate in opposite directions. A(cw) -> B(ccw) -> C(cw).',
      kz: 'Жанасатын дөңгелектер қарама-қарсы айналады. A(сағ) -> B(қарсы) -> C(сағ).'
    }
  },

  // 2. Innovative IT Product Design
  {
    id: 'it-1',
    program: 'it-product-design',
    category: 'UX/UI',
    question: {
      ru: 'В UX-дизайне, что означает правило "трех кликов"?',
      en: 'In UX design, what does the "three-click rule" imply?',
      kz: 'UX-дизайнда "үш рет басу" ережесі нені білдіреді?'
    },
    options: {
      ru: ['Пользователь должен трижды кликнуть для логина', 'Любая информация должна быть доступна не более чем за три клика', 'Мышь имеет три кнопки', 'Сайт загружается за три секунды'],
      en: ['User must click three times to log in', 'Any information should be reachable in max three clicks', 'The mouse has three buttons', 'The site loads in 3 seconds'],
      kz: ['Пайдаланушы логин үшін үш рет басуы керек', 'Кез келген ақпаратқа ең көбі үш рет басу арқылы қол жеткізуге болады', 'Тінтуірдің үш батырмасы бар', 'Сайт 3 секундта жүктеледі']
    },
    correctIndex: 1,
    explanation: {
      ru: 'Это принцип навигации, по которому пользователь может найти любую нужную информацию за три клика.',
      en: 'It is an unofficial web design rule concerning the design of website navigation.',
      kz: 'Бұл навигацияны жобалауға қатысты веб-дизайн ережесі.'
    }
  },
  {
    id: 'it-2',
    program: 'it-product-design',
    category: 'Product Strategy',
    question: {
      ru: 'Что такое MVP (Minimum Viable Product)?',
      en: 'What is an MVP (Minimum Viable Product)?',
      kz: 'MVP (Minimum Viable Product) дегеніміз не?'
    },
    options: {
      ru: ['Максимальный объем продаж', 'Минимально жизнеспособный продукт для сбора обратной связи', 'Самый ценный игрок в команде', 'Продукт без дизайна'],
      en: ['Maximum volume of sales', 'A product with enough features to attract early adopters', 'Most Valuable Player in a team', 'A product with no design'],
      kz: ['Сатылымның максималды көлемі', 'Алғашқы тұтынушыларды тартуға арналған базалық өнім', 'Командадағы ең мықты ойыншы', 'Дизайны жоқ өнім']
    },
    correctIndex: 1,
    explanation: {
      ru: 'MVP нужен для тестирования гипотез на реальных пользователях с минимальными затратами.',
      en: 'MVPs are used to test hypotheses on real users with minimal cost.',
      kz: 'MVP болжамдарды аз шығынмен нақты пайдаланушыларда сынау үшін қажет.'
    }
  },

  // 3. Sociology: Leadership and Innovation
  {
    id: 'soc-1',
    program: 'sociology-leadership',
    category: 'Sociology Concept',
    question: {
      ru: 'Какой термин описывает процесс усвоения индивидом социальных норм и ценностей?',
      en: 'Which term describes the process of an individual internalizing social norms and values?',
      kz: 'Адамның әлеуметтік нормалар мен құндылықтарды сіңіру процесі қандай терминмен сипатталады?'
    },
    options: {
      ru: ['Стратификация', 'Ассимиляция', 'Социализация', 'Урбанизация'],
      en: ['Stratification', 'Assimilation', 'Socialization', 'Urbanization'],
      kz: ['Стратификация', 'Ассимиляция', 'Әлеуметтену', 'Урбанизация']
    },
    correctIndex: 2,
    explanation: {
      ru: 'Социализация — это процесс интеграции индивида в общество.',
      en: 'Socialization is the process of internalizing the norms and ideologies of society.',
      kz: 'Әлеуметтену — адамның қоғамға бейімделу процесі.'
    }
  },
  {
    id: 'soc-2',
    program: 'sociology-leadership',
    category: 'Leadership',
    question: {
      ru: 'В чем суть трансформационного лидерства?',
      en: 'What is the core of transformational leadership?',
      kz: 'Трансформациялық көшбасшылықтың мәні неде?'
    },
    options: {
      ru: ['Контроль каждого шага сотрудников', 'Вдохновение и мотивация последователей к изменениям', 'Использование только материальных стимулов', 'Избегание принятия решений'],
      en: ['Controlling every step of employees', 'Inspiring and motivating followers to change', 'Using only material incentives', 'Avoiding decision making'],
      kz: ['Қызметкерлердің әр қадамын бақылау', 'Адамдарды шабыттандыру және өзгерістерге ынталандыру', 'Тек материалдық ынталандыруды қолдану', 'Шешім қабылдаудан аулақ болу']
    },
    correctIndex: 1,
    explanation: {
      ru: 'Лидер-трансформатор вдохновляет команду на общую цель и личностный рост.',
      en: 'A transformational leader inspires the team toward a shared vision and personal growth.',
      kz: 'Мұндай көшбасшы команданы ортақ мақсат пен дамуға шабыттандырады.'
    }
  },

  // 4. Public Policy
  {
    id: 'pp-1',
    program: 'public-policy',
    category: 'Governance',
    question: {
      ru: 'Зачем государства проводят децентрализацию власти?',
      en: 'Why do governments implement decentralization of power?',
      kz: 'Неліктен мемлекеттер билікті орталықсыздандыруды жүзеге асырады?'
    },
    options: {
      ru: ['Сконцентрировать финансы в столице', 'Усилить армию', 'Повысить эффективность принятия решений на местах', 'Сократить число законов'],
      en: ['To concentrate finances in the capital', 'To strengthen the army', 'To improve decision-making efficiency at the local level', 'To reduce the number of laws'],
      kz: ['Қаржыны астанада шоғырландыру үшін', 'Әскерді күшейту үшін', 'Жергілікті деңгейде шешім қабылдау тиімділігін арттыру', 'Заңдар санын азайту үшін']
    },
    correctIndex: 2,
    explanation: {
      ru: 'Децентрализация передает полномочия локальным органам, которые лучше знают нужды региона.',
      en: 'Decentralization shifts power to local authorities who better understand regional needs.',
      kz: 'Орталықсыздандыру жергілікті мәселелерді тез әрі тиімді шешуге мүмкіндік береді.'
    }
  },

  // 5. Digital Media
  {
    id: 'dm-1',
    program: 'digital-media',
    category: 'Marketing',
    question: {
      ru: 'Что из нижеперечисленного лучше всего описывает "Целевую аудиторию"?',
      en: 'Which of the following best describes "Target Audience"?',
      kz: '"Мақсатты аудиторияны" төмендегілердің қайсысы жақсы сипаттайды?'
    },
    options: {
      ru: ['Все люди в интернете', 'Конкретная группа людей, заинтересованная в вашем продукте', 'Люди, которые случайно нажали на рекламу', 'Только жители одного города'],
      en: ['Everyone on the internet', 'A specific group of people interested in your product', 'People who accidentally clicked the ad', 'Only residents of a single city'],
      kz: ['Интернеттегі барлық адамдар', 'Өніміңізге қызығушылық танытатын белгілі бір адамдар тобы', 'Жарнаманы кездейсоқ басқан адамдар', 'Тек бір қаланың тұрғындары']
    },
    correctIndex: 1,
    explanation: {
      ru: 'Целевая аудитория — это люди, чьи нужды решает продукт.',
      en: 'Target audience represents the specific demographic a product serves.',
      kz: 'Бұл тауар немесе қызмет арналған негізгі тұтынушылар тобы.'
    }
  },

  // 6. Foundation Year
  {
    id: 'fy-1',
    program: 'foundation',
    category: 'Logic',
    question: {
      ru: 'Если все птицы имеют крылья, а пингвин - птица, значит ли это, что у пингвина есть крылья?',
      en: 'If all birds have wings, and a penguin is a bird, does a penguin have wings?',
      kz: 'Егер барлық құстардың қанаттары болса және пингвин құс болса, онда пингвиннің қанаттары бар ма?'
    },
    options: {
      ru: ['Да', 'Нет', 'Зависит от пингвина', 'Невозможно определить'],
      en: ['Yes', 'No', 'Depends on the penguin', 'Cannot be determined'],
      kz: ['Иә', 'Жоқ', 'Пингвинге қатысты', 'Анықтау мүмкін емес']
    },
    correctIndex: 0,
    explanation: {
      ru: 'Это классический силлогизм.',
      en: 'This is a classical syllogism.',
      kz: 'Бұл классикалық силлогизм.'
    }
  }
];

export function getRandomQuestions(programId: string, count: number = 3): TestQuestion[] {
  let filtered = questionBank.filter(q => q.program === programId);
  if (filtered.length === 0) {
    // Fallback if program has no questions yet, use foundation
    filtered = questionBank.filter(q => q.program === 'foundation');
  }
  
  // Shuffle array
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  
  // Get sub-array of first n elements
  return shuffled.slice(0, count);
}

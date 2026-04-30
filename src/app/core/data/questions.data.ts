import { Question } from '../models/question.model';

export const LEVEL_TEST_QUESTIONS: Question[] = [
  // ==================== NIVEL A1 (10 preguntas) ====================
  {
    id: 1,
    level: 'A1',
    question: '¿Cuál es la forma correcta?',
    options: [
      { id: 1, text: 'I have the apple.', correct: false },
      { id: 2, text: 'I have an apple.', correct: true },
      { id: 3, text: 'I have apple.', correct: false },
    ],
    explanation:
      'Usamos "an" delante de palabras que empiezan con sonido vocal. Significa una manzana cualquiera, no una específica.',
  },
  {
    id: 2,
    level: 'A1',
    question: '¿Cuál es la forma correcta de preguntar?',
    options: [
      { id: 1, text: 'You like pizza?', correct: false },
      { id: 2, text: 'Do you like pizza?', correct: true },
      { id: 3, text: 'You do like pizza?', correct: false },
    ],
    explanation: 'En inglés usamos "do" para formar preguntas en presente simple.',
  },
  {
    id: 3,
    level: 'A1',
    question: '¿Cuál es la forma negativa correcta?',
    options: [
      { id: 1, text: 'I no like coffee.', correct: false },
      { id: 2, text: 'I don’t like coffee.', correct: true },
      { id: 3, text: 'I not like coffee.', correct: false },
    ],
    explanation: 'Usamos "don’t" para hacer la forma negativa en presente simple.',
  },
  {
    id: 4,
    level: 'A1',
    question: '¿Cuál es la forma correcta de expresar posesión?',
    options: [
      { id: 1, text: 'I’ve got a book.', correct: true },
      { id: 2, text: 'I has a book.', correct: false },
      { id: 3, text: 'I got a book.', correct: false },
    ],
    explanation: 'Decimos "I’ve got" o "I have", pero "I has" nunca es correcto.',
  },
  {
    id: 5,
    level: 'A1',
    question: '¿Cómo expresamos hábitos en inglés?',
    options: [
      { id: 1, text: 'I am going to school every day.', correct: false },
      { id: 2, text: 'I go to school every day.', correct: true },
      { id: 3, text: 'I goes to school every day.', correct: false },
    ],
    explanation: 'Usamos presente simple para hábitos y rutinas.',
  },
  {
    id: 6,
    level: 'A1',
    question: '¿Cuál es la forma correcta de decir "me gusta mucho"?',
    options: [
      { id: 1, text: 'I like it very much.', correct: true },
      { id: 2, text: 'I very like it.', correct: false },
      { id: 3, text: 'Me like it very much.', correct: false },
    ],
    explanation: 'La estructura en inglés es diferente al español. "I" es el sujeto, no "me".',
  },
  {
    id: 7,
    level: 'A1',
    question: '¿Cuál es la pregunta correcta?',
    options: [
      { id: 1, text: 'Does your sister speaks Italian?', correct: false },
      { id: 2, text: 'Does your sister speak Italian?', correct: true },
      { id: 3, text: 'Is your sister speak Italian?', correct: false },
    ],
    explanation:
      'Usamos "does" con tercera persona del singular. Después de "does", el verbo nunca lleva -s.',
  },
  {
    id: 8,
    level: 'A1',
    question: '¿Cuál es la forma correcta de posesión?',
    options: [
      { id: 1, text: 'Him boss is very intelligent.', correct: false },
      { id: 2, text: 'His boss is very intelligent.', correct: true },
      { id: 3, text: 'He boss is very intelligent.', correct: false },
    ],
    explanation: 'Usamos "his" para indicar posesión (su - de él).',
  },
  {
    id: 9,
    level: 'A1',
    question: '¿Cuál es la forma negativa correcta?',
    options: [
      { id: 1, text: 'He hasn’t a car.', correct: false },
      { id: 2, text: 'He haven’t a car.', correct: false },
      { id: 3, text: 'He doesn’t have a car.', correct: true },
    ],
    explanation: 'Otra opción sería "He hasn’t got a car", que suena más británica.',
  },
  {
    id: 10,
    level: 'A1',
    question: '¿Cuál es la preposición correcta?',
    options: [
      { id: 1, text: 'I’ll see you on Sunday.', correct: true },
      { id: 2, text: 'I’ll see you at Sunday.', correct: false },
      { id: 3, text: 'I’ll see you in Sunday.', correct: false },
    ],
    explanation: 'Usamos "on" con los días de la semana.',
  },

  // ==================== NIVEL A2 (10 preguntas) ====================
  {
    id: 11,
    level: 'A2',
    question: '¿Cómo se dice correctamente "ir a casa"?',
    options: [
      { id: 1, text: 'I need to go to the home.', correct: false },
      { id: 2, text: 'I need to go home.', correct: true },
      { id: 3, text: 'I need to go to home.', correct: false },
    ],
    explanation: 'Para decir "ir a casa" solo usamos "go home", sin preposición.',
  },
  {
    id: 12,
    level: 'A2',
    question: '¿Cuál es la pregunta correcta?',
    options: [
      { id: 1, text: 'How many brothers do you have?', correct: true },
      { id: 2, text: 'How many brothers you have?', correct: false },
      { id: 3, text: 'How many brothers do you got?', correct: false },
    ],
    explanation: 'Las preguntas en inglés necesitan el auxiliar "do" antes del sujeto.',
  },
  {
    id: 13,
    level: 'A2',
    question: '¿Cuál es el comparativo correcto?',
    options: [
      { id: 1, text: 'My car is more fast than yours.', correct: false },
      { id: 2, text: 'My car is faster than yours.', correct: true },
      { id: 3, text: 'My car is more faster than yours.', correct: false },
    ],
    explanation: 'Los adjetivos cortos usan "-er" en el comparativo (fast → faster).',
  },
  {
    id: 14,
    level: 'A2',
    question: '¿Cuál es la forma correcta de decir "esperar a alguien"?',
    options: [
      { id: 1, text: 'I’m waiting you.', correct: false },
      { id: 2, text: 'I’m waiting for you.', correct: true },
      { id: 3, text: 'I’m waiting at you.', correct: false },
    ],
    explanation: 'Siempre decimos "wait for" + alguien.',
  },
  {
    id: 15,
    level: 'A2',
    question: '¿Cómo preguntamos por el precio?',
    options: [
      { id: 1, text: 'How many does this cost?', correct: false },
      { id: 2, text: 'How much does this cost?', correct: true },
      { id: 3, text: 'How much do this cost?', correct: false },
    ],
    explanation: 'Usamos "how much" para preguntar por precios (dinero).',
  },
  {
    id: 16,
    level: 'A2',
    question: '¿Qué palabra usamos cuando hay opciones limitadas?',
    options: [
      { id: 1, text: 'Which do you want, the red or the blue jumper?', correct: true },
      { id: 2, text: 'What do you want, the red or the blue jumper?', correct: false },
      { id: 3, text: 'Who do you want, the red or the blue jumper?', correct: false },
    ],
    explanation: 'Usamos "which" cuando hay opciones limitadas para elegir.',
  },
  {
    id: 17,
    level: 'A2',
    question: '¿Cuál es el pasado correcto de "teach"?',
    options: [
      { id: 1, text: 'My grandfather teach me how to paint.', correct: false },
      { id: 2, text: 'My grandfather teached me how to paint.', correct: false },
      { id: 3, text: 'My grandfather taught me how to paint.', correct: true },
    ],
    explanation: '"Taught" es el pasado correcto del verbo "teach".',
  },
  {
    id: 18,
    level: 'A2',
    question: '¿Cuál es la forma correcta?',
    options: [
      { id: 1, text: 'I want to go to bed now.', correct: true },
      { id: 2, text: 'I am wanting to go to bed now.', correct: false },
      { id: 3, text: 'I am want to go to bed now.', correct: false },
    ],
    explanation: 'Normalmente no usamos "want" en forma continua (present continuous).',
  },
  {
    id: 19,
    level: 'A2',
    question: '¿Cómo decimos "una vez a la semana"?',
    options: [
      { id: 1, text: 'Once to week, we go dancing.', correct: false },
      { id: 2, text: 'Once a week, we go dancing.', correct: true },
      { id: 3, text: 'Once during week, we go dancing.', correct: false },
    ],
    explanation: 'Decimos "once a week", "twice a month", etc.',
  },
  {
    id: 20,
    level: 'A2',
    question: '¿Cuál es la forma correcta con "people"?',
    options: [
      { id: 1, text: 'There isn’t much people here.', correct: false },
      { id: 2, text: 'There aren’t many people here.', correct: true },
      { id: 3, text: 'There isn’t much people here.', correct: false },
    ],
    explanation: 'Usamos "many" con sustantivos contables como "people".',
  },

  // ==================== NIVEL B1 (10 preguntas) ====================
  {
    id: 21,
    level: 'B1',
    question: '¿Cuál es la forma más educada para solicitar un trabajo?',
    options: [
      { id: 1, text: 'I wanna apply for this job.', correct: false },
      { id: 2, text: 'I would like to apply for this job.', correct: true },
      { id: 3, text: 'I want applying for this job.', correct: false },
    ],
    explanation:
      'Usamos "I would like to" en situaciones formales, como solicitudes de trabajo. Es más educado que "I want".',
  },
  {
    id: 22,
    level: 'B1',
    question: '¿Cómo expresamos propósito correctamente?',
    options: [
      { id: 1, text: 'I came here for to meet people.', correct: false },
      { id: 2, text: 'I came here to meet people.', correct: true },
      { id: 3, text: 'I came fee for meet people.', correct: false },
    ],
    explanation: 'Usamos "to + verbo" para expresar propósito, no "for to".',
  },
  {
    id: 23,
    level: 'B1',
    question: '¿Cuál es la preposición correcta para ciudades?',
    options: [
      { id: 1, text: 'We arrived at Dublin very early.', correct: false },
      { id: 2, text: 'We arrived in Dublin very early.', correct: true },
      { id: 3, text: 'We arrived to Dublin very early.', correct: false },
    ],
    explanation: 'Usamos "in" para ciudades y países. Usamos "at" para lugares pequeños.',
  },
  {
    id: 24,
    level: 'B1',
    question: '¿Cuál es la forma correcta con "nobody"?',
    options: [
      { id: 1, text: 'Nobody understands what’s happened.', correct: true },
      { id: 2, text: 'Nobody doesn’t understand what’s happened.', correct: false },
      { id: 3, text: 'Nobody don’t understand what’s happened.', correct: false },
    ],
    explanation:
      '"Nobody" ya es negativo, por eso no usamos "don’t" ni "doesn’t". En inglés solo se usa una negación.',
  },
  {
    id: 25,
    level: 'B1',
    question: '¿Qué tiempo verbal usamos para una acción en progreso interrumpida?',
    options: [
      { id: 1, text: 'We were talking when the bus appeared.', correct: true },
      { id: 2, text: 'We have talked when the bus appeared.', correct: false },
      { id: 3, text: 'We talked when the bus appeared.', correct: false },
    ],
    explanation:
      'Para una acción en progreso cuando otra acción ocurrió, usamos past continuous + past simple.',
  },
  {
    id: 26,
    level: 'B1',
    question: '¿Qué tiempo usamos para acciones terminadas con referencia temporal?',
    options: [
      { id: 1, text: 'I moved to Brazil in 2005.', correct: true },
      { id: 2, text: 'I have moved to Brazil in 2005.', correct: false },
      { id: 3, text: 'I was moved to Brazil in 2005.', correct: false },
    ],
    explanation:
      'Usamos past simple para acciones terminadas en el pasado con una referencia temporal (in 2005).',
  },
  {
    id: 27,
    level: 'B1',
    question: '¿Cómo expresamos que no hemos visitado un lugar desde hace tiempo?',
    options: [
      { id: 1, text: 'I haven’t been to China since 2002.', correct: true },
      { id: 2, text: 'I didn’t go to China since 2002.', correct: false },
      { id: 3, text: 'I haven’t gone to China since 2002.', correct: false },
    ],
    explanation: '"Haven’t been" significa que visitamos en el pasado, pero no desde entonces.',
  },
  {
    id: 28,
    level: 'B1',
    question: '¿Qué palabra usamos para hablar de un lugar?',
    options: [
      { id: 1, text: 'This is the city where she grew up.', correct: true },
      { id: 2, text: 'This is the city which she grew up.', correct: false },
      { id: 3, text: 'This is the city she grew up at.', correct: false },
    ],
    explanation: 'Usamos "where" para hablar del lugar donde ocurrió la acción.',
  },
  {
    id: 29,
    level: 'B1',
    question: '¿Cómo reportamos una pregunta en pasado?',
    options: [
      { id: 1, text: 'He asked me what I wanted.', correct: true },
      { id: 2, text: 'He asked me what I want.', correct: false },
      { id: 3, text: 'He asked me that I wanted.', correct: false },
    ],
    explanation:
      'Cuando reportamos un discurso en pasado, cambiamos el verbo a pasado: "want" → "wanted".',
  },
  {
    id: 30,
    level: 'B1',
    question: '¿Qué preposición usamos con "good" para habilidades?',
    options: [
      { id: 1, text: 'I’m good at math.', correct: true },
      { id: 2, text: 'I’m good in math.', correct: false },
      { id: 3, text: 'I’m good with math.', correct: false },
    ],
    explanation: 'Siempre usamos "good at" + actividad o materia.',
  },

  // ==================== NIVEL B2 (10 preguntas) ====================
  {
    id: 31,
    level: 'B2',
    question: '¿Cuál es el uso correcto de "despite"?',
    options: [
      { id: 1, text: 'Despite the cold, we went swimming.', correct: true },
      { id: 2, text: 'Despite that it was cold, we went swimming.', correct: false },
      { id: 3, text: 'In spite cold, we went swimming.', correct: false },
    ],
    explanation:
      'Después de "despite", usamos un sustantivo o gerundio, no una frase completa con "that".',
  },
  {
    id: 32,
    level: 'B2',
    question: '¿Cuál es la estructura correcta con "such" y "so"?',
    options: [
      { id: 1, text: 'It was such a cold day that we couldn’t work.', correct: true },
      { id: 2, text: 'It was so a cold day that we couldn’t work.', correct: false },
      { id: 3, text: 'It was so cold day that we couldn’t work.', correct: false },
    ],
    explanation:
      'Usamos "such a + adjetivo + sustantivo". "So" se usa solo con adjetivo: "It was so cold".',
  },
  {
    id: 33,
    level: 'B2',
    question: '¿Cómo decimos "mucho más caro" correctamente?',
    options: [
      { id: 1, text: 'It was much more expensive than I thought it would be.', correct: true },
      { id: 2, text: 'It was much expensive than I thought it would be.', correct: false },
      { id: 3, text: 'It was much more expensive than I thought it will be.', correct: false },
    ],
    explanation:
      'Usamos "much more expensive" para decir "mucho más caro" y "would" porque la acción de pensar ocurrió en el pasado.',
  },
  {
    id: 34,
    level: 'B2',
    question: '¿Cuál es la forma correcta en present perfect?',
    options: [
      { id: 1, text: 'We’ve just got back from the holiday.', correct: true },
      { id: 2, text: 'We´ve just get back from the holiday.', correct: false },
      { id: 3, text: 'We´ve already get from the holiday.', correct: false },
    ],
    explanation: 'En present perfect usamos: have/has + past participle (got).',
  },
  {
    id: 35,
    level: 'B2',
    question: '¿Cómo expresamos posibilidad en el futuro?',
    options: [
      { id: 1, text: 'If it’s sunny, we might have a picnic later.', correct: true },
      { id: 2, text: 'If it’s sunny, we have a picnic later.', correct: false },
      { id: 3, text: 'If it’s sunny, we are having a picnic later.', correct: false },
    ],
    explanation: '"Might" expresa posibilidad, no certeza.',
  },
  {
    id: 36,
    level: 'B2',
    question: '¿Cuál es la diferencia entre "tell" y "say"?',
    options: [
      { id: 1, text: 'He told me he was hungry.', correct: true },
      { id: 2, text: 'He told that he was hungry.', correct: false },
      { id: 3, text: 'He said me he was hungry.', correct: false },
    ],
    explanation: 'Usamos "tell someone" y "say something".',
  },
  {
    id: 37,
    level: 'B2',
    question: '¿Cómo damos consejos en inglés?',
    options: [
      { id: 1, text: 'If I were you, I would tell him your plans.', correct: true },
      { id: 2, text: 'If I was you, I will tell him your plans.', correct: false },
      { id: 3, text: 'If I would be you, I would tell him your plans.', correct: false },
    ],
    explanation: 'Usamos "If I were you" para dar consejos en inglés.',
  },
  {
    id: 38,
    level: 'B2',
    question: '¿Cuál es la forma correcta de voz pasiva?',
    options: [
      { id: 1, text: 'My phone has been stolen.', correct: true },
      { id: 2, text: 'Someone has stole my phone.', correct: false },
      { id: 3, text: 'My phone has stolen.', correct: false },
    ],
    explanation: 'Esto es voz pasiva: el objeto (my phone) se convierte en sujeto.',
  },
  {
    id: 39,
    level: 'B2',
    question: '¿Qué palabra usamos para contrastar ideas?',
    options: [
      {
        id: 1,
        text: 'He was offered the job; nevertheless, he decided to decline it.',
        correct: true,
      },
      { id: 2, text: 'He was offered the job; despite, he decided to decline it.', correct: false },
      {
        id: 3,
        text: 'He was offered the job; although, he decided to decline it.',
        correct: false,
      },
    ],
    explanation: '"Nevertheless" se usa para contrastar dos ideas (a pesar de eso).',
  },
  {
    id: 40,
    level: 'B2',
    question: '¿Qué es un "Mixed Conditional"?',
    options: [
      {
        id: 1,
        text: 'If she had studied harder, she would be working at that company now.',
        correct: true,
      },
      {
        id: 2,
        text: 'If she studied harder, she would have been working at that company now.',
        correct: false,
      },
      {
        id: 3,
        text: 'If she had studied harder, she will be working at that company now.',
        correct: false,
      },
    ],
    explanation:
      'Es una estructura mixta: condición en el pasado + resultado en el presente. Se llama Mixed Conditional.',
  },

  // ==================== NIVEL C1 (10 preguntas) ====================
  {
    id: 41,
    level: 'C1',
    question: '¿Cómo expresamos que alguien hace algo por nosotros?',
    options: [
      { id: 1, text: 'He is having his hair cut.', correct: true },
      { id: 2, text: 'He has his hair cut.', correct: false },
      { id: 3, text: 'He is having cut his hair.', correct: false },
    ],
    explanation: 'Usamos "have something done" cuando otra persona realiza la acción por nosotros.',
  },
  {
    id: 42,
    level: 'C1',
    question: '¿Cuál es la forma negativa de "have something done"?',
    options: [
      { id: 1, text: 'Christy isn’t getting her boiler replaced.', correct: true },
      { id: 2, text: 'Christy hasn’t got her boiler replaced.', correct: false },
      { id: 3, text: 'Christy is having her boiler replace.', correct: false },
    ],
    explanation: 'Otra vez: "have/get something done" = alguien hace la acción por nosotros.',
  },
  {
    id: 43,
    level: 'C1',
    question: '¿Cuál es la forma correcta con adverbio negativo?',
    options: [
      { id: 1, text: 'Never have I seen such a view.', correct: true },
      { id: 2, text: 'Never I have seen such a view.', correct: false },
      { id: 3, text: 'Never have I seen such view.', correct: false },
    ],
    explanation:
      'Cuando empezamos con un adverbio negativo (never, rarely), invertimos sujeto y verbo.',
  },
  {
    id: 44,
    level: 'C1',
    question: '¿Qué palabra usamos en "cleft sentences" para énfasis?',
    options: [
      { id: 1, text: 'It was studying English that helped me.', correct: true },
      { id: 2, text: 'It was studying English what helped me.', correct: false },
      { id: 3, text: 'It was studying English which helped me.', correct: false },
    ],
    explanation: 'Usamos "that" en frases de énfasis (cleft sentences).',
  },
  {
    id: 45,
    level: 'C1',
    question: '¿Cuál es la estructura correcta del third conditional?',
    options: [
      { id: 1, text: 'If I had known, I would have told you.', correct: true },
      { id: 2, text: 'If I would have known, I would have told you.', correct: false },
      { id: 3, text: 'If I knew, I would have told you.', correct: false },
    ],
    explanation:
      'Estructura: past perfect en la condición + would have + past participle en el resultado.',
  },
  {
    id: 46,
    level: 'C1',
    question: '¿Qué phrasal verb significa "adelantar una reunión"?',
    options: [
      { id: 1, text: 'The manager decided to bring forward the meeting to Monday.', correct: true },
      { id: 2, text: 'The manager decided to bring up the meeting to Monday.', correct: false },
      { id: 3, text: 'The manager decided to bring on the meeting to Monday.', correct: false },
    ],
    explanation: '"Bring forward" significa adelantar la fecha de la reunión.',
  },
  {
    id: 47,
    level: 'C1',
    question: '¿Qué significa "taken aback"?',
    options: [
      { id: 1, text: 'She was taken aback by his unexpected proposal.', correct: true },
      { id: 2, text: 'She was taken over by his unexpected proposal.', correct: false },
      { id: 3, text: 'She was taken through by his unexpected proposal.', correct: false },
    ],
    explanation: '"Taken aback" significa sorprendida o impactada.',
  },
  {
    id: 48,
    level: 'C1',
    question: '¿Qué phrasal verb significa "resolver problemas"?',
    options: [
      { id: 1, text: 'We need to iron out the remaining issues.', correct: true },
      { id: 2, text: 'We need to iron up the remaining issues.', correct: false },
      { id: 3, text: 'We need to iron off the remaining issues.', correct: false },
    ],
    explanation: '"Iron out" significa resolver pequeños problemas o detalles.',
  },
  {
    id: 49,
    level: 'C1',
    question: '¿Cuál es la forma correcta con "rarely"?',
    options: [
      { id: 1, text: 'Rarely have I encountered such a thought-provoking book.', correct: true },
      { id: 2, text: 'Rarely I have encountered such a thought-provoking book.', correct: false },
      { id: 3, text: 'Rarely did I encountering such a thought-provoking book.', correct: false },
    ],
    explanation:
      'Los adverbios negativos como "rarely" también provocan inversión del sujeto y verbo.',
  },
  {
    id: 50,
    level: 'C1',
    question: '¿Qué significa la expresión "the ball is in your court"?',
    options: [
      { id: 1, text: 'I’ve done all I can; now the ball is in your court.', correct: true },
      { id: 2, text: 'I’ve done all I can; now the ball is in your field.', correct: false },
      { id: 3, text: 'I’ve done all I can; now the ball is on your side.', correct: false },
    ],
    explanation: '"The ball is in your court" significa: ahora te toca a ti actuar o decidir.',
  },
];

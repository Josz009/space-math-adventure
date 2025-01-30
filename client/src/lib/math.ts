import { z } from 'zod';

export interface MathProblem {
  question: string;
  options: string[];
  answer: string;
  difficulty: number;
}

type Operations = {
  addition: string;
  subtraction: string;
  multiplication: string;
  division: string;
  percentages: string;
  mixed: string;
};

const operations: Operations = {
  addition: '+',
  subtraction: '-',
  multiplication: '*',
  division: '/',
  percentages: '%',
  mixed: 'mixed'
};

function generateNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Large array of word problem templates for each operation
const wordProblems = {
  '+': [
    (n1: number, n2: number) => `If you have ${n1} space rocks and find ${n2} more, how many do you have in total?`,
    (n1: number, n2: number) => `Your spaceship has ${n1} fuel cells and you add ${n2} more. How many fuel cells do you have now?`,
    (n1: number, n2: number) => `There are ${n1} stars in one galaxy and ${n2} in another. How many stars are there in total?`,
    (n1: number, n2: number) => `A space station has ${n1} astronauts, and ${n2} more arrive. How many astronauts are there now?`,
    (n1: number, n2: number) => `You collect ${n1} moon rocks on Monday and ${n2} on Tuesday. How many rocks did you collect in total?`,
    (n1: number, n2: number) => `There are ${n1} satellites orbiting Mars and ${n2} orbiting Venus. How many satellites are there altogether?`,
    (n1: number, n2: number) => `Your space garden grows ${n1} space tomatoes, then produces ${n2} more. What's the total number of tomatoes?`,
    (n1: number, n2: number) => `The first rocket carries ${n1} passengers and the second carries ${n2}. How many total passengers are there?`
  ],
  '-': [
    (n1: number, n2: number) => `You start with ${n1} astronauts and ${n2} return to Earth. How many remain in space?`,
    (n1: number, n2: number) => `Your space station has ${n1} rooms and ${n2} are damaged. How many rooms are still usable?`,
    (n1: number, n2: number) => `You have ${n1} oxygen tanks but ${n2} are empty. How many full tanks remain?`,
    (n1: number, n2: number) => `A space fleet has ${n1} ships, but ${n2} need repairs. How many ships are ready for mission?`,
    (n1: number, n2: number) => `There were ${n1} asteroids, but ${n2} were destroyed. How many asteroids are left?`,
    (n1: number, n2: number) => `The space kitchen had ${n1} freeze-dried meals, but used ${n2} today. How many meals are left?`,
    (n1: number, n2: number) => `Out of ${n1} space suits, ${n2} are being cleaned. How many are available right now?`,
    (n1: number, n2: number) => `The observatory spotted ${n1} comets last week, but ${n2} have passed by. How many are still visible?`
  ],
  '*': [
    (n1: number, n2: number) => `Each space colony needs ${n1} solar panels. How many panels do ${n2} colonies need?`,
    (n1: number, n2: number) => `If each alien has ${n1} eyes, how many eyes do ${n2} aliens have?`,
    (n1: number, n2: number) => `A space garden has ${n2} rows with ${n1} plants in each row. How many plants are there in total?`,
    (n1: number, n2: number) => `Each space mission needs ${n1} astronauts. How many astronauts are needed for ${n2} missions?`,
    (n1: number, n2: number) => `If each rocket uses ${n1} fuel cells, how many cells do ${n2} rockets need?`,
    (n1: number, n2: number) => `Each alien spaceship has ${n1} windows. How many windows are on ${n2} spaceships?`,
    (n1: number, n2: number) => `A meteor shower drops ${n1} meteors per minute. How many meteors fall in ${n2} minutes?`,
    (n1: number, n2: number) => `Each space station level has ${n1} rooms. How many rooms are in ${n2} levels?`
  ],
  '/': [
    (n1: number, n2: number) => `You need to divide ${n1} astronauts into ${n2} equal teams. How many astronauts will be in each team?`,
    (n1: number, n2: number) => `If you have ${n1} space snacks to share among ${n2} crew members equally, how many will each person get?`,
    (n1: number, n2: number) => `You need to pack ${n1} oxygen tanks into containers that hold ${n2} tanks each. How many full containers will you have?`,
    (n1: number, n2: number) => `${n1} space tourists need to be split into ${n2} equal groups. How many tourists per group?`,
    (n1: number, n2: number) => `If ${n1} moon rocks need to be stored in boxes of ${n2}, how many full boxes will there be?`,
    (n1: number, n2: number) => `The space kitchen has ${n1} meals to serve to ${n2} equal groups. How many meals per group?`,
    (n1: number, n2: number) => `${n1} satellites need to be monitored by ${n2} teams equally. How many satellites per team?`,
    (n1: number, n2: number) => `If ${n1} space suits need to be divided among ${n2} airlocks equally, how many suits per airlock?`
  ],
  '%': [
    (n1: number, n2: number) => `What is ${n2}% of ${n1} space credits?`,
    (n1: number, n2: number) => `If ${n2}% of ${n1} astronauts prefer freeze-dried ice cream, how many astronauts is that?`,
    (n1: number, n2: number) => `If ${n2}% of ${n1} satellites are operational, how many satellites are working?`,
    (n1: number, n2: number) => `${n2}% of ${n1} space missions were successful. How many missions succeeded?`,
    (n1: number, n2: number) => `If ${n2}% of ${n1} asteroids contain precious metals, how many asteroids have metals?`,
    (n1: number, n2: number) => `${n2}% of ${n1} space plants produced oxygen. How many plants made oxygen?`,
    (n1: number, n2: number) => `If ${n2}% of ${n1} crew members are scientists, how many scientists are there?`,
    (n1: number, n2: number) => `${n2}% of ${n1} space rocks were collected. How many rocks were gathered?`
  ]
};

function generateWordProblem(operation: string, num1: number, num2: number): string {
  const problems = wordProblems[operation as keyof typeof wordProblems];
  const randomIndex = Math.floor(Math.random() * problems.length);
  return problems[randomIndex](num1, num2);
}

export function generateMathProblem(difficulty: number, topic: keyof Operations = 'mixed'): MathProblem {
  const operation = topic === 'mixed' 
    ? operations[Object.keys(operations)[Math.floor(Math.random() * (Object.keys(operations).length - 1))] as keyof Operations]
    : operations[topic];

  let num1: number, num2: number, answer: number;
  const useWordProblem = Math.random() < 0.85; // High probability of word problems

  // Generate numbers based on difficulty and operation
  switch (operation) {
    case '+':
      if (difficulty === 1) {
        num1 = generateNumber(2, 20);
        num2 = generateNumber(2, 20);
      } else if (difficulty === 2) {
        num1 = generateNumber(15, 50);
        num2 = generateNumber(15, 50);
      } else {
        // Make more challenging combinations
        const options = [
          () => [generateNumber(50, 999), generateNumber(50, 999)], // Large numbers
          () => [generateNumber(100, 500), generateNumber(500, 999)], // Mixed sizes
          () => [generateNumber(1000, 2000), generateNumber(50, 100)] // Very large + small
        ];
        [num1, num2] = options[Math.floor(Math.random() * options.length)]();
      }
      answer = num1 + num2;
      break;

    case '-':
      if (difficulty === 1) {
        num2 = generateNumber(1, 10);
        num1 = generateNumber(num2 + 1, num2 + 10);
      } else if (difficulty === 2) {
        num2 = generateNumber(10, 30);
        num1 = generateNumber(num2 + 1, num2 + 50);
      } else {
        // More challenging combinations
        const options = [
          () => [generateNumber(500, 999), generateNumber(50, 100)],
          () => [generateNumber(1000, 2000), generateNumber(100, 500)],
          () => [generateNumber(200, 500), generateNumber(50, 150)]
        ];
        [num1, num2] = options[Math.floor(Math.random() * options.length)]();
      }
      answer = num1 - num2;
      break;

    case '*':
      if (difficulty === 1) {
        // Basic multiplication tables
        const tables = [2, 3, 4, 5, 10];
        num1 = tables[Math.floor(Math.random() * tables.length)];
        num2 = generateNumber(1, 10);
      } else if (difficulty === 2) {
        // More complex combinations
        const options = [
          () => [generateNumber(2, 12), generateNumber(11, 15)],
          () => [generateNumber(5, 15), generateNumber(5, 15)],
          () => [generateNumber(10, 20), generateNumber(2, 10)]
        ];
        [num1, num2] = options[Math.floor(Math.random() * options.length)]();
      } else {
        // Advanced combinations
        const options = [
          () => [generateNumber(11, 20), generateNumber(11, 20)],
          () => [generateNumber(15, 25), generateNumber(5, 15)],
          () => [generateNumber(20, 30), generateNumber(5, 10)]
        ];
        [num1, num2] = options[Math.floor(Math.random() * options.length)]();
      }
      answer = num1 * num2;
      break;

    case '/':
      if (difficulty === 1) {
        // Simple division with small numbers
        num2 = generateNumber(2, 5);
        answer = generateNumber(1, 10);
      } else if (difficulty === 2) {
        // Medium difficulty divisions
        num2 = generateNumber(3, 8);
        answer = generateNumber(5, 15);
      } else {
        // More complex divisions
        const options = [
          () => [generateNumber(5, 12), generateNumber(10, 20)],
          () => [generateNumber(8, 15), generateNumber(5, 15)],
          () => [generateNumber(10, 20), generateNumber(5, 10)]
        ];
        const [divisor, quotient] = options[Math.floor(Math.random() * options.length)]();
        num2 = divisor;
        answer = quotient;
      }
      num1 = num2 * answer; // Ensure clean division
      break;

    case '%':
      if (difficulty === 1) {
        // Simple percentages (10%, 20%, etc.)
        const commonPercentages = [10, 20, 25, 50, 75, 100];
        num2 = commonPercentages[Math.floor(Math.random() * commonPercentages.length)];
        num1 = generateNumber(10, 100);
      } else if (difficulty === 2) {
        // More varied percentages
        num2 = generateNumber(1, 20) * 5; // 5%, 10%, 15%, etc.
        num1 = generateNumber(20, 200);
      } else {
        // Complex percentage calculations
        const options = [
          () => [generateNumber(50, 500), generateNumber(1, 100)],
          () => [generateNumber(200, 1000), generateNumber(5, 95)],
          () => [generateNumber(100, 300), generateNumber(15, 85)]
        ];
        [num1, num2] = options[Math.floor(Math.random() * options.length)]();
      }
      answer = Math.round((num1 * num2) / 100);
      break;

    default:
      num1 = generateNumber(1, 20);
      num2 = generateNumber(1, 20);
      answer = num1 + num2;
  }

  // Randomize between word problem and equation format
  const question = useWordProblem 
    ? generateWordProblem(operation, num1, num2)
    : `${num1} ${operation} ${num2} = ?`;

  // Generate wrong answers based on common mistake patterns
  const wrongAnswers = new Set<number>();

  while (wrongAnswers.size < 3) {
    let wrongAnswer: number;

    if (operation === '%') {
      const variations = [
        Math.round((num1 * (num2 + 10)) / 100),
        Math.round((num1 * (num2 - 10)) / 100),
        Math.round((num1 * num2 * 2) / 100),
        Math.round((num1 * (num2 / 2)) / 100),
        answer + Math.round(answer * 0.1),
        answer - Math.round(answer * 0.1)
      ];
      wrongAnswer = variations[Math.floor(Math.random() * variations.length)];
    } else {
      // Common mistake patterns based on operation
      const variations = [
        answer + generateNumber(1, Math.max(5, Math.floor(answer * 0.2))),
        answer - generateNumber(1, Math.max(5, Math.floor(answer * 0.2))),
        operation === '*' ? num1 + num2 : answer * 2,
        operation === '/' ? num1 + num2 : Math.floor(answer / 2),
        operation === '+' ? num1 * num2 : answer + 5,
        operation === '-' ? num1 * num2 : answer - 5
      ];
      wrongAnswer = variations[Math.floor(Math.random() * variations.length)];
    }

    if (wrongAnswer !== answer && wrongAnswer >= 0) {
      wrongAnswers.add(wrongAnswer);
    }
  }

  return {
    question,
    options: [answer.toString(), ...Array.from(wrongAnswers).map(w => w.toString())].sort(() => Math.random() - 0.5),
    answer: answer.toString(),
    difficulty,
  };
}

export function calculateDifficulty(performance: { correct: number; total: number }): number {
  const accuracy = performance.correct / performance.total;
  if (accuracy > 0.8) return Math.min(3, Math.ceil(performance.correct / 5));
  if (accuracy > 0.6) return Math.max(1, Math.ceil(performance.correct / 7));
  return 1;
}
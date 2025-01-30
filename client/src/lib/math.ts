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

function generateWrongAnswer(correct: number, min: number, max: number): number {
  let wrong = correct;
  while (wrong === correct) {
    const offset = Math.random() < 0.5 ? -1 : 1;
    wrong = correct + (generateNumber(min, max) * offset);
  }
  return wrong;
}

function generateWordProblem(operation: string, num1: number, num2: number): string {
  const scenarios = {
    '+': [
      `If you have ${num1} space rocks and find ${num2} more, how many do you have in total?`,
      `Your spaceship has ${num1} fuel cells and you add ${num2} more. How many fuel cells do you have now?`,
      `There are ${num1} stars in one galaxy and ${num2} in another. How many stars are there in total?`
    ],
    '-': [
      `You start with ${num1} astronauts and ${num2} return to Earth. How many remain in space?`,
      `Your space station has ${num1} rooms and ${num2} are damaged. How many rooms are still usable?`,
      `You have ${num1} oxygen tanks but ${num2} are empty. How many full tanks remain?`
    ],
    '*': [
      `Each space colony needs ${num1} solar panels. How many panels do ${num2} colonies need?`,
      `If each alien has ${num1} eyes, how many eyes do ${num2} aliens have?`,
      `A space garden has ${num2} rows with ${num1} plants in each row. How many plants are there in total?`
    ],
    '/': [
      `You need to divide ${num1} astronauts into ${num2} equal teams. How many astronauts will be in each team?`,
      `If you have ${num1} space snacks to share among ${num2} crew members equally, how many will each person get?`,
      `You need to pack ${num1} oxygen tanks into containers that hold ${num2} tanks each. How many full containers will you have?`
    ],
    '%': [
      `What is ${num2}% of ${num1} space credits?`,
      `If ${num2}% of astronauts from ${num1} total prefer freeze-dried ice cream, how many astronauts is that?`,
      `If ${num2}% of ${num1} satellites are operational, how many satellites are working?`
    ]
  };

  const scenarioArray = scenarios[operation as keyof typeof scenarios];
  return scenarioArray[Math.floor(Math.random() * scenarioArray.length)];
}

export function generateMathProblem(difficulty: number, topic: keyof Operations = 'mixed'): MathProblem {
  const operation = topic === 'mixed' 
    ? operations[Object.keys(operations)[Math.floor(Math.random() * (Object.keys(operations).length - 1))] as keyof Operations]
    : operations[topic];

  let num1: number, num2: number, answer: number;
  const useWordProblem = Math.random() < 0.5;

  switch (difficulty) {
    case 1: // Basic
      num1 = generateNumber(1, 12);
      num2 = generateNumber(1, 12);
      break;
    case 2: // Intermediate
      num1 = generateNumber(10, 50);
      num2 = generateNumber(2, 25);
      break;
    case 3: // Advanced
      num1 = generateNumber(20, 100);
      num2 = generateNumber(5, 30);
      break;
    default:
      num1 = generateNumber(1, 12);
      num2 = generateNumber(1, 12);
  }

  switch (operation) {
    case '+':
      if (difficulty === 3) {
        // Make it more challenging with triple-digit numbers
        num1 = generateNumber(100, 999);
        num2 = generateNumber(100, 999);
      }
      answer = num1 + num2;
      break;

    case '-':
      // Ensure no negative numbers for young students
      if (num1 < num2) [num1, num2] = [num2, num1];
      if (difficulty === 3) {
        // Make it more challenging with triple-digit numbers
        num1 = generateNumber(500, 999);
        num2 = generateNumber(100, num1);
      }
      answer = num1 - num2;
      break;

    case '*':
      // Adjust numbers for multiplication to be more manageable
      if (difficulty === 1) {
        num1 = generateNumber(2, 10);
        num2 = generateNumber(2, 10);
      } else if (difficulty === 2) {
        num1 = generateNumber(2, 12);
        num2 = generateNumber(11, 15);
      } else {
        num1 = generateNumber(11, 20);
        num2 = generateNumber(11, 20);
      }
      answer = num1 * num2;
      break;

    case '/':
      // Ensure division results in whole numbers
      if (difficulty === 1) {
        num2 = generateNumber(2, 5);
        answer = generateNumber(1, 10);
      } else if (difficulty === 2) {
        num2 = generateNumber(3, 8);
        answer = generateNumber(5, 15);
      } else {
        num2 = generateNumber(5, 12);
        answer = generateNumber(10, 20);
      }
      num1 = num2 * answer;
      break;

    case '%':
      // Generate percentage problems based on difficulty
      if (difficulty === 1) {
        num2 = generateNumber(1, 5) * 10; // 10%, 20%, etc.
        num1 = generateNumber(1, 100);
      } else if (difficulty === 2) {
        num2 = generateNumber(1, 10) * 5; // 5%, 10%, 15%, etc.
        num1 = generateNumber(20, 200);
      } else {
        num2 = generateNumber(1, 100); // Any percentage
        num1 = generateNumber(50, 500);
      }
      answer = Math.round((num1 * num2) / 100);
      break;

    default:
      answer = num1 + num2;
  }

  const question = useWordProblem && operation !== '%' 
    ? generateWordProblem(operation, num1, num2)
    : `${num1} ${operation} ${num2} = ?`;

  let wrongAnswers: number[];
  if (operation === '%') {
    // Generate percentage-specific wrong answers
    wrongAnswers = [
      Math.round((num1 * (num2 + 10)) / 100),
      Math.round((num1 * (num2 - 10)) / 100),
      Math.round((num1 * num2 * 2) / 100)
    ];
  } else {
    // Generate wrong answers based on common mistakes
    wrongAnswers = [
      generateWrongAnswer(answer, 1, Math.max(5, Math.floor(answer * 0.2))),
      generateWrongAnswer(answer, 1, Math.max(3, Math.floor(answer * 0.1))),
      operation === '*' ? num1 + num2 : generateWrongAnswer(answer, 1, Math.max(4, Math.floor(answer * 0.15)))
    ];
  }

  return {
    question,
    options: [answer.toString(), ...wrongAnswers.map(w => w.toString())].sort(() => Math.random() - 0.5),
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
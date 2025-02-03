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
  decimals_addition: string;
  decimals_subtraction: string;
  mixed_operations: string;
};

const operations: Operations = {
  addition: '+',
  subtraction: '-',
  multiplication: '*',
  division: '/',
  percentages: '%',
  decimals_addition: 'decimal+',
  decimals_subtraction: 'decimal-',
  mixed_operations: 'mixed'
};

function generateNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDecimal(min: number, max: number, decimals: number = 2): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
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
  ],
  'decimal+': [
    (n1: number, n2: number) => `A space fuel tank contains ${n1} liters and you add ${n2} more liters. How many liters do you have now?`,
    (n1: number, n2: number) => `Your spaceship weighs ${n1} tons and picks up ${n2} tons of cargo. What's the total weight?`,
    (n1: number, n2: number) => `The temperature increases by ${n2} degrees from ${n1} degrees. What's the final temperature?`,
    (n1: number, n2: number) => `A cosmic dust sample weighs ${n1} grams, and you find another weighing ${n2} grams. What's their combined weight?`
  ],
  'decimal-': [
    (n1: number, n2: number) => `You have ${n1} liters of space fuel and use ${n2} liters. How many liters remain?`,
    (n1: number, n2: number) => `The space station's temperature drops by ${n2} degrees from ${n1} degrees. What's the new temperature?`,
    (n1: number, n2: number) => `Your cargo weighs ${n1} tons and you unload ${n2} tons. How many tons are left?`,
    (n1: number, n2: number) => `A satellite orbits at ${n1} kilometers and descends by ${n2} kilometers. What's its new altitude?`
  ],
  'mixed': [
    (n1: number, n2: number, n3: number) => `You collect ${n1} space rocks, find ${n2} more, but lose ${n3}. How many do you have now?`,
    (n1: number, n2: number, n3: number) => `Your spaceship has ${n1} crew members, ${n2} more join, but ${n3} return to Earth. How many remain?`,
    (n1: number, n2: number, n3: number) => `You start with ${n1} fuel cells, add ${n2} new ones, then use ${n3}. How many are left?`,
    (n1: number, n2: number, n3: number) => `A space garden has ${n1} plants, grows ${n2} more, but ${n3} don't survive. How many plants remain?`,
    (n1: number, n2: number, n3: number) => `A space station has ${n1} solar panels, installs ${n2} new ones, but ${n3} get damaged. How many working panels remain?`,
    (n1: number, n2: number, n3: number) => `You find ${n1} crystals in an asteroid, collect ${n2} more from another, and use ${n3} for experiments. How many crystals do you have left?`,
    (n1: number, n2: number, n3: number) => `The space kitchen starts with ${n1} meals, prepares ${n2} more, but ${n3} are consumed by the crew. How many meals are available?`,
    (n1: number, n2: number, n3: number) => `Your oxygen supply shows ${n1} hours, you gain ${n2} hours from backup tanks, but use ${n3} hours during a spacewalk. How many hours remain?`,
    (n1: number, n2: number, n3: number) => `Your fuel gauge reads ${n1.toFixed(1)} liters, you add ${n2.toFixed(1)} liters, but use ${n3.toFixed(1)} liters for landing. How many liters remain?`,
    (n1: number, n2: number, n3: number) => `A satellite orbits at ${n1.toFixed(1)} km altitude, rises by ${n2.toFixed(1)} km, then descends ${n3.toFixed(1)} km. What's its final altitude?`,
    (n1: number, n2: number, n3: number) => `The space station temperature is ${n1.toFixed(1)}°C, increases by ${n2.toFixed(1)}°C, then drops ${n3.toFixed(1)}°C. What's the final temperature?`,
    (n1: number, n2: number, n3: number) => `A cosmic sample weighs ${n1.toFixed(2)} grams, gains ${n2.toFixed(2)} grams of matter, but loses ${n3.toFixed(2)} grams through analysis. What's its final weight?`,
        (n1: number, n2: number, n3: number) => `An asteroid field has ${n1} large rocks, splits into ${n2} more pieces, but ${n3} pieces drift away. How many pieces remain in the field?`,
    (n1: number, n2: number, n3: number) => `Your space colony starts with ${n1} water tanks, receives ${n2} from Earth, but uses ${n3} for irrigation. How many tanks are left?`,
    (n1: number, n2: number, n3: number) => `The observatory spots ${n1} comets, discovers ${n2} more, but loses track of ${n3}. How many comets are they currently tracking?`
  ]
};

function generateWordProblem(operation: string, num1: number, num2: number, num3?: number): string {
  const problems = wordProblems[operation as keyof typeof wordProblems];
  const randomIndex = Math.floor(Math.random() * problems.length);
  return num3 !== undefined 
    ? (problems[randomIndex] as any)(num1, num2, num3)
    : problems[randomIndex](num1, num2);
}

export function generateMathProblem(difficulty: number, topic: keyof Operations = 'mixed'): MathProblem {
  let num1: number, num2: number, num3: number | undefined, answer: number;
  const useWordProblem = Math.random() < 0.85;

  const operation = topic === 'mixed_operations'
    ? operations.mixed_operations
    : operations[topic];

  // Generate numbers based on difficulty and operation
  switch (operation) {
    case 'decimal+':
    case 'decimal-': {
      const decimals = difficulty === 1 ? 1 : 2;
      if (difficulty === 1) {
        num1 = generateDecimal(1, 20, decimals);
        num2 = generateDecimal(1, 10, decimals);
      } else if (difficulty === 2) {
        num1 = generateDecimal(10, 50, decimals);
        num2 = generateDecimal(5, 25, decimals);
      } else {
        num1 = generateDecimal(20, 100, decimals);
        num2 = generateDecimal(10, 50, decimals);
      }
      answer = operation === 'decimal+' 
        ? Number((num1 + num2).toFixed(decimals))
        : Number((num1 - num2).toFixed(decimals));
      break;
    }

    case 'mixed': {
      if (difficulty === 1) {
        // For beginners: smaller numbers, maybe one decimal place
        const useDecimals = Math.random() < 0.3; // 30% chance for decimals
        if (useDecimals) {
          num1 = generateDecimal(5, 20, 1);
          num2 = generateDecimal(1, 10, 1);
          num3 = generateDecimal(1, 5, 1);
        } else {
          num1 = generateNumber(5, 20);
          num2 = generateNumber(1, 10);
          num3 = generateNumber(1, 5);
        }
      } else if (difficulty === 2) {
        // Medium difficulty: larger numbers, more decimals
        const useDecimals = Math.random() < 0.5; // 50% chance for decimals
        if (useDecimals) {
          num1 = generateDecimal(10, 50, 1);
          num2 = generateDecimal(5, 25, 1);
          num3 = generateDecimal(5, 15, 1);
        } else {
          num1 = generateNumber(10, 50);
          num2 = generateNumber(5, 25);
          num3 = generateNumber(5, 15);
        }
      } else {
        // Advanced: larger numbers, more complex decimals
        const useDecimals = Math.random() < 0.7; // 70% chance for decimals
        if (useDecimals) {
          num1 = generateDecimal(20, 100, 2);
          num2 = generateDecimal(10, 50, 2);
          num3 = generateDecimal(10, 30, 2);
        } else {
          num1 = generateNumber(20, 100);
          num2 = generateNumber(10, 50);
          num3 = generateNumber(10, 30);
        }
      }
      // Random choice between different operation combinations
      const operationType = Math.random();
      if (operationType < 0.4) {
        // Addition then subtraction
        answer = num1 + num2 - num3;
      } else if (operationType < 0.8) {
        // Subtraction then addition
        answer = num1 - num2 + num3;
      } else {
        // Double addition or double subtraction (more challenging)
        answer = Math.random() < 0.5 ? num1 + num2 + num3 : num1 - num2 - num3;
      }
      // If we used decimals, round the answer
      if (typeof num1 === 'number' && num1 % 1 !== 0) {
        answer = Number(answer.toFixed(2));
      }
      break;
    }
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
      return generateMathProblem(difficulty, 'addition');
  }

  // Generate question
  const question = operation === 'mixed'
    ? generateWordProblem('mixed', num1, num2, num3)
    : generateWordProblem(operation, num1, num2);

  // Generate wrong answers
  const wrongAnswers = new Set<number>();

  while (wrongAnswers.size < 3) {
    let wrongAnswer: number;

    if (operation === 'decimal+' || operation === 'decimal-') {
      const variations = [
        Number((answer + generateDecimal(0.1, 2, 2)).toFixed(2)),
        Number((answer - generateDecimal(0.1, 2, 2)).toFixed(2)),
        Number((answer * 1.5).toFixed(2)),
        Number((answer * 0.5).toFixed(2))
      ];
      wrongAnswer = variations[Math.floor(Math.random() * variations.length)];
    } else if (operation === 'mixed') {
      const variations = [
        answer + generateNumber(1, 5),
        answer - generateNumber(1, 5),
        num1 + num2, // Forgetting the third operation
        num1 - num2, // Forgetting the third operation
        (num1 + num2 + (num3 || 0)) // Adding all numbers
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
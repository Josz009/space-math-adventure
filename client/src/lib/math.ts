export interface MathProblem {
  question: string;
  options: string[];
  answer: string;
  difficulty: number;
}

const operations = {
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
    wrong = generateNumber(min, max);
  }
  return wrong;
}

export function generateMathProblem(difficulty: number, topic: string = 'mixed'): MathProblem {
  let operation = topic === 'mixed' 
    ? operations[Object.keys(operations)[Math.floor(Math.random() * (Object.keys(operations).length - 1))]]
    : operations[topic];

  let num1: number, num2: number, answer: number;

  switch (difficulty) {
    case 1: // Basic
      num1 = generateNumber(1, 10);
      num2 = generateNumber(1, 10);
      break;
    case 2: // Intermediate
      num1 = generateNumber(10, 50);
      num2 = generateNumber(1, 20);
      break;
    case 3: // Advanced
      num1 = generateNumber(20, 100);
      num2 = generateNumber(10, 50);
      break;
    default:
      num1 = generateNumber(1, 10);
      num2 = generateNumber(1, 10);
  }

  switch (operation) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      // Ensure no negative numbers for young students
      if (num1 < num2) [num1, num2] = [num2, num1];
      answer = num1 - num2;
      break;
    case '*':
      // Adjust numbers for multiplication to be more manageable
      num1 = Math.min(num1, 12);
      num2 = Math.min(num2, 12);
      answer = num1 * num2;
      break;
    case '/':
      // Ensure division results in whole numbers
      answer = num2;
      num1 = num2 * generateNumber(1, 10);
      break;
    case '%':
      // Generate percentage problems
      num2 = generateNumber(1, 10) * 10; // Percentages like 10%, 20%, etc.
      num1 = generateNumber(1, 100);
      answer = (num1 * num2) / 100;
      return {
        question: `What is ${num2}% of ${num1}?`,
        options: [
          answer.toString(),
          (answer + 10).toString(),
          (answer - 10).toString(),
          (answer * 2).toString(),
        ].sort(() => Math.random() - 0.5),
        answer: answer.toString(),
        difficulty,
      };
    default:
      answer = num1 + num2;
  }

  const options = [
    answer.toString(),
    generateWrongAnswer(answer, Math.max(0, answer - 10), answer + 10).toString(),
    generateWrongAnswer(answer, Math.max(0, answer - 5), answer + 15).toString(),
    generateWrongAnswer(answer, Math.max(0, answer - 15), answer + 5).toString(),
  ].sort(() => Math.random() - 0.5);

  return {
    question: `${num1} ${operation} ${num2} = ?`,
    options,
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
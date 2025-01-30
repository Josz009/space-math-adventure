export interface MathProblem {
  question: string;
  options: string[];
  answer: string;
  difficulty: number;
}

const operations = ['+', '-', '*', '/'];

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

export function generateMathProblem(difficulty: number): MathProblem {
  const operation = operations[Math.floor(Math.random() * operations.length)];
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
      answer = num1 - num2;
      break;
    case '*':
      answer = num1 * num2;
      break;
    case '/':
      // Ensure division results in whole numbers
      answer = num2;
      num1 = num2 * generateNumber(1, 10);
      break;
    default:
      answer = num1 + num2;
  }

  const options = [
    answer.toString(),
    generateWrongAnswer(answer, answer - 10, answer + 10).toString(),
    generateWrongAnswer(answer, answer - 5, answer + 15).toString(),
    generateWrongAnswer(answer, answer - 15, answer + 5).toString(),
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

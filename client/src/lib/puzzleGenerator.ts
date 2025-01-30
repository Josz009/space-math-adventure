import { z } from "zod";

// Define difficulty ranges per grade
const GRADE_RANGES = {
  1: { min: 1, max: 10 },
  2: { min: 1, max: 20 },
  3: { min: 1, max: 50 },
  4: { min: 1, max: 100 },
  5: { min: 1, max: 1000 }
};

// Helper to generate random number within range
const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Generate word problems with real-world contexts
const CONTEXTS = {
  addition: [
    { template: "There are {n1} red balloons and {n2} blue balloons. How many balloons are there in total?", items: ['balloons', 'marbles', 'stickers'] },
    { template: "You have {n1} apples and your friend gives you {n2} more. How many apples do you have now?", items: ['apples', 'books', 'pencils'] }
  ],
  subtraction: [
    { template: "You have {n1} candies and give {n2} to your friend. How many candies do you have left?", items: ['candies', 'cards', 'toys'] },
    { template: "There are {n1} birds in a tree and {n2} fly away. How many birds are left?", items: ['birds', 'butterflies', 'leaves'] }
  ],
  multiplication: [
    { template: "There are {n1} rows with {n2} objects in each row. How many objects are there in total?", items: ['desks', 'flowers', 'books'] },
    { template: "Each box has {n2} items. How many items are in {n1} boxes?", items: ['pencils', 'erasers', 'crayons'] }
  ],
  division: [
    { template: "{n1} objects need to be divided equally into {n2} groups. How many objects will be in each group?", items: ['candies', 'stickers', 'marbles'] },
    { template: "You want to share {n1} {item} equally among {n2} friends. How many will each friend get?", items: ['cookies', 'cards', 'toys'] }
  ]
};

// Generate appropriate emojis for visual representation
const CATEGORY_EMOJIS = {
  addition: ['➕', '🎈', '🍎', '📚', '✏️'],
  subtraction: ['➖', '🍬', '🦋', '🎴', '🧸'],
  multiplication: ['✖️', '📚', '🌸', '📦', '🎨'],
  division: ['➗', '🍪', '🎯', '🎪', '🎨']
};

export interface GeneratedPuzzle {
  id: string;
  type: string;
  question: string;
  answer: string;
  hint: string;
  image: string;
}

export const generatePuzzle = (category: string, grade: number): GeneratedPuzzle => {
  const id = Date.now().toString();
  const range = GRADE_RANGES[grade as keyof typeof GRADE_RANGES] || GRADE_RANGES[4];

  let puzzle: GeneratedPuzzle;

  switch (category) {
    case 'addition': {
      const num1 = randomNumber(range.min, range.max);
      const num2 = randomNumber(range.min, range.max);
      const context = CONTEXTS.addition[Math.floor(Math.random() * CONTEXTS.addition.length)];
      const item = context.items[Math.floor(Math.random() * context.items.length)];
      const question = context.template
        .replace('{n1}', num1.toString())
        .replace('{n2}', num2.toString())
        .replace('objects', item);

      puzzle = {
        id,
        type: 'addition',
        question,
        answer: (num1 + num2).toString(),
        hint: `Add ${num1} and ${num2}`,
        image: CATEGORY_EMOJIS.addition[Math.floor(Math.random() * CATEGORY_EMOJIS.addition.length)]
      };
      break;
    }

    case 'subtraction': {
      const num1 = randomNumber(range.min, range.max);
      const num2 = randomNumber(range.min, num1); // Ensure num2 is not greater than num1
      const context = CONTEXTS.subtraction[Math.floor(Math.random() * CONTEXTS.subtraction.length)];
      const item = context.items[Math.floor(Math.random() * context.items.length)];
      const question = context.template
        .replace('{n1}', num1.toString())
        .replace('{n2}', num2.toString())
        .replace('objects', item);

      puzzle = {
        id,
        type: 'subtraction',
        question,
        answer: (num1 - num2).toString(),
        hint: `Subtract ${num2} from ${num1}`,
        image: CATEGORY_EMOJIS.subtraction[Math.floor(Math.random() * CATEGORY_EMOJIS.subtraction.length)]
      };
      break;
    }

    case 'multiplication': {
      const factor1 = randomNumber(2, Math.min(12, range.max));
      const factor2 = randomNumber(2, Math.min(12, range.max));
      const context = CONTEXTS.multiplication[Math.floor(Math.random() * CONTEXTS.multiplication.length)];
      const item = context.items[Math.floor(Math.random() * context.items.length)];
      const question = context.template
        .replace('{n1}', factor1.toString())
        .replace('{n2}', factor2.toString())
        .replace('objects', item);

      puzzle = {
        id,
        type: 'multiplication',
        question,
        answer: (factor1 * factor2).toString(),
        hint: `Think of ${factor1} groups with ${factor2} ${item} in each group`,
        image: CATEGORY_EMOJIS.multiplication[Math.floor(Math.random() * CATEGORY_EMOJIS.multiplication.length)]
      };
      break;
    }

    case 'division': {
      const divisor = randomNumber(2, Math.min(12, range.max));
      const result = randomNumber(1, Math.min(10, range.max));
      const dividend = divisor * result;
      const context = CONTEXTS.division[Math.floor(Math.random() * CONTEXTS.division.length)];
      const item = context.items[Math.floor(Math.random() * context.items.length)];
      const question = context.template
        .replace('{n1}', dividend.toString())
        .replace('{n2}', divisor.toString())
        .replace('{item}', item);

      puzzle = {
        id,
        type: 'division',
        question,
        answer: result.toString(),
        hint: `${dividend} divided by ${divisor} means splitting ${dividend} ${item} into ${divisor} equal groups`,
        image: CATEGORY_EMOJIS.division[Math.floor(Math.random() * CATEGORY_EMOJIS.division.length)]
      };
      break;
    }

    default: {
      // Default to addition if category is not recognized
      const num1 = randomNumber(range.min, range.max);
      const num2 = randomNumber(range.min, range.max);
      puzzle = {
        id,
        type: 'addition',
        question: `What is ${num1} + ${num2}?`,
        answer: (num1 + num2).toString(),
        hint: `Add ${num1} and ${num2}`,
        image: '➕'
      };
    }
  }

  return puzzle;
};
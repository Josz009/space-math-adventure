import { z } from "zod";

// Define difficulty ranges per grade
const GRADE_RANGES = {
  1: { min: 1, max: 10 },
  2: { min: 1, max: 20 },
  3: { min: 1, max: 50 },
  4: { min: 1, max: 100 },
  5: { min: 1, max: 1000 }
};

// Define operations allowed per grade
const GRADE_OPERATIONS = {
  1: ['addition', 'subtraction'],
  2: ['addition', 'subtraction', 'basic_multiplication'],
  3: ['addition', 'subtraction', 'multiplication', 'basic_division'],
  4: ['multiplication', 'division', 'fractions', 'decimals'],
  5: ['multiplication', 'division', 'fractions', 'decimals', 'percentages']
};

// Helper to generate random number within range
const randomNumber = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to ensure multiplication problems are grade-appropriate
const generateMultiplicationNumbers = (grade: number) => {
  const range = GRADE_RANGES[grade as keyof typeof GRADE_RANGES];
  const factor1 = randomNumber(2, Math.min(12, range.max));
  const factor2 = randomNumber(2, Math.min(12, range.max));
  return { factor1, factor2 };
};

// Generate word problems with real-world contexts
const CONTEXTS = {
  multiplication: [
    { template: "There are {n1} rows with {n2} objects in each row. How many objects are there in total?", items: ['desks', 'flowers', 'books', 'cookies'] },
    { template: "A teacher has {n1} boxes with {n2} pencils in each box. How many pencils are there in total?", items: ['pencils', 'markers', 'erasers', 'crayons'] },
    { template: "In a garden, there are {n1} trees and each tree has {n2} fruits. How many fruits are there in total?", items: ['apples', 'oranges', 'pears', 'plums'] }
  ],
  division: [
    { template: "There are {n1} objects that need to be divided equally into {n2} groups. How many objects will be in each group?", items: ['candies', 'stickers', 'marbles', 'cards'] },
    { template: "{n1} students need to be divided into {n2} equal teams. How many students will be in each team?", items: ['students'] }
  ]
};

// Generate appropriate emojis for visual representation
const CATEGORY_EMOJIS = {
  multiplication: ['🎲', '📚', '🍪', '🌸', '✏️', '📦'],
  division: ['🍕', '🎪', '📏', '🎯', '🎨'],
  fractions: ['🍰', '🍕', '🍫', '📊', '⭐'],
  decimals: ['💰', '📏', '⚖️', '🏃', '📐'],
  basic_operations: ['🔢', '🎯', '🎲', '🎮', '🎨']
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
    case 'multiplication': {
      const { factor1, factor2 } = generateMultiplicationNumbers(grade);
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
        .replace('objects', item);
      
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
      // Default to basic multiplication for now
      const { factor1, factor2 } = generateMultiplicationNumbers(grade);
      puzzle = {
        id,
        type: 'multiplication',
        question: `What is ${factor1} × ${factor2}?`,
        answer: (factor1 * factor2).toString(),
        hint: `Think of ${factor1} groups of ${factor2} objects`,
        image: '🎲'
      };
    }
  }
  
  return puzzle;
};

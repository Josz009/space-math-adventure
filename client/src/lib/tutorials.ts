import { type ReactElement } from 'react';

export interface TutorialStep {
  explanation: string;
  visualComponent: ReactElement;
}

export interface Tutorial {
  topic: string;
  title: string;
  description: string;
  steps: TutorialStep[];
}

export const MATH_TUTORIALS: Record<string, Tutorial> = {
  addition: {
    topic: 'addition',
    title: 'Adding Numbers in Space',
    description: 'Learn how to add numbers by combining groups of space objects!',
    steps: []
  },
  subtraction: {
    topic: 'subtraction',
    title: 'Space Subtraction',
    description: 'Learn how to subtract by removing objects from a group!',
    steps: []
  },
  multiplication: {
    topic: 'multiplication',
    title: 'Multiplication in the Galaxy',
    description: 'Learn multiplication by creating equal groups of space objects!',
    steps: []
  },
  division: {
    topic: 'division',
    title: 'Division in Deep Space',
    description: 'Learn division by sharing objects equally among groups!',
    steps: []
  },
  decimals_addition: {
    topic: 'decimals_addition',
    title: 'Adding Decimal Numbers',
    description: 'Learn how to add decimal numbers in space measurements!',
    steps: []
  },
  decimals_subtraction: {
    topic: 'decimals_subtraction',
    title: 'Subtracting Decimal Numbers',
    description: 'Learn how to subtract decimal numbers in space calculations!',
    steps: []
  },
  mixed_operations: {
    topic: 'mixed_operations',
    title: 'Combined Operations Challenge',
    description: 'Test your skills with mixed addition and subtraction problems!',
    steps: []
  },
  percentages: {
    topic: 'percentages',
    title: 'Space Percentages',
    description: 'Learn percentages by exploring parts of space colonies!',
    steps: []
  }
};
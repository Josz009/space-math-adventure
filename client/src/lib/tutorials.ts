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
  percentages: {
    topic: 'percentages',
    title: 'Space Percentages',
    description: 'Learn percentages by exploring parts of space colonies!',
    steps: []
  }
};

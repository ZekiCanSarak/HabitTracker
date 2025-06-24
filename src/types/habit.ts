export type Frequency = 'daily' | 'weekly';
export type Category = 'fitness' | 'study' | 'self-care' | 'work' | 'health' | 'other';

export interface Reminder {
  enabled: boolean;
  time?: string; // HH:mm format
  days?: number[]; // 0-6 for Sunday-Saturday
}

export interface HabitStats {
  longestStreak: number;
  currentStreak: number;
  totalCompletions: number;
  level: number;
  xp: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earnedAt: string;
}

export interface Habit {
  id: string;
  name: string;
  frequency: Frequency;
  createdAt: string;
  color: string;
  category: Category;
  reminder: Reminder;
  order: number;
  stats: HabitStats;
  badges: Badge[];
}

export interface HabitCompletion {
  habitId: string;
  date: string;
  completed: boolean;
}

export interface HabitWithCompletion extends Habit {
  completions: HabitCompletion[];
}

export interface Profile {
  id: string;
  name: string;
  createdAt: string;
  preferences: {
    theme: string;
    language: string;
  };
}

export interface UndoableAction {
  type: 'ADD' | 'UPDATE' | 'DELETE' | 'TOGGLE';
  payload: any;
  timestamp: number;
} 
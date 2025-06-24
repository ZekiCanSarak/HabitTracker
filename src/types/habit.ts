export type Frequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  name: string;
  frequency: Frequency;
  createdAt: string;
  color: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string;
  completed: boolean;
}

export interface HabitWithCompletion extends Habit {
  completions: HabitCompletion[];
} 
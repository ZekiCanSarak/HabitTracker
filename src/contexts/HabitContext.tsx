import { createContext, useContext, useState } from 'react';
import { Habit, HabitCompletion } from '../types/habit';

interface HabitContextType {
  habits: Habit[];
  completions: HabitCompletion[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (habitId: string, date: string) => void;
}

const HabitContext = createContext<HabitContextType | null>(null);

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const updateHabit = (updatedHabit: Habit) => {
    setHabits(prev => prev.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    ));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
    setCompletions(prev => prev.filter(completion => completion.habitId !== id));
  };

  const toggleCompletion = (habitId: string, date: string) => {
    setCompletions(prev => {
      const existingCompletion = prev.find(
        c => c.habitId === habitId && c.date === date
      );

      if (existingCompletion) {
        return prev.map(c =>
          c.habitId === habitId && c.date === date
            ? { ...c, completed: !c.completed }
            : c
        );
      }

      return [...prev, { habitId, date, completed: true }];
    });
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        completions,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleCompletion,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}; 
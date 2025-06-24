import { useState } from 'react';
import { format, startOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import { useHabits } from '../contexts/HabitContext';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import type { Habit } from '../types/habit';
import HabitEditForm from './HabitEditForm';
import { useTheme } from '../contexts/ThemeContext';

const HabitList = () => {
  const { habits, completions, toggleCompletion, deleteHabit } = useHabits();
  const { currentTheme } = useTheme();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  });

  const isCompleted = (habitId: string, date: string) => {
    return completions.some(
      (c) => c.habitId === habitId && c.date === date && c.completed
    );
  };

  return (
    <div>
      {editingHabit && (
        <div className="mb-6">
          <div className="card">
            <HabitEditForm
              habit={editingHabit}
              onClose={() => setEditingHabit(null)}
            />
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-64" style={{ color: currentTheme.colors.text }}>
                Habit
              </th>
              {weekDays.map((day) => (
                <th
                  key={day.toISOString()}
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                  style={{ color: currentTheme.colors.text }}
                >
                  {format(day, 'EEE')}
                  <br />
                  {format(day, 'd')}
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{ color: currentTheme.colors.text }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id} className="habit-row">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className="flex-shrink-0 h-4 w-4 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium">{habit.name}</div>
                      <div className="text-sm opacity-75">{habit.frequency}</div>
                    </div>
                  </div>
                </td>
                {weekDays.map((day) => (
                  <td
                    key={day.toISOString()}
                    className="px-6 py-4 whitespace-nowrap text-center"
                  >
                    <button
                      onClick={() =>
                        toggleCompletion(habit.id, format(day, 'yyyy-MM-dd'))
                      }
                      className="w-8 h-8 rounded-lg transition-colors"
                      style={{
                        backgroundColor: isCompleted(habit.id, format(day, 'yyyy-MM-dd'))
                          ? habit.color
                          : currentTheme.colors.cardBackground,
                        borderColor: currentTheme.colors.secondary,
                        borderWidth: '1px'
                      }}
                    />
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => setEditingHabit(habit)}
                      className="transition-colors"
                      style={{ color: currentTheme.colors.secondary }}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="transition-colors hover:text-red-500"
                      style={{ color: currentTheme.colors.secondary }}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HabitList; 
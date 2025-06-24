import { useState } from 'react';
import { format, startOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import { useHabits } from '../contexts/HabitContext';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import type { Habit } from '../types/habit';
import HabitEditForm from './HabitEditForm';

const HabitList = () => {
  const { habits, completions, toggleCompletion, deleteHabit } = useHabits();
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                Habit
              </th>
              {weekDays.map((day) => (
                <th
                  key={day.toISOString()}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {format(day, 'EEE')}
                  <br />
                  {format(day, 'd')}
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {habits.map((habit) => (
              <tr key={habit.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 h-4 w-4 rounded-full ${habit.color}`}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium">{habit.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {habit.frequency}
                      </div>
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
                      className={`w-8 h-8 rounded-lg transition-colors ${
                        isCompleted(habit.id, format(day, 'yyyy-MM-dd'))
                          ? `${habit.color} bg-opacity-100`
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    />
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => setEditingHabit(habit)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-gray-400 hover:text-red-500"
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
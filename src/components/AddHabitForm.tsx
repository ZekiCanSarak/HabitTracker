import { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Frequency } from '../types/habit';

interface AddHabitFormProps {
  onClose: () => void;
}

const COLORS = [
  'bg-red-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
];

const AddHabitForm = ({ onClose }: AddHabitFormProps) => {
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [color, setColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addHabit({
      name: name.trim(),
      frequency,
      color,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Add New Habit</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-500"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Habit Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          placeholder="e.g., Drink water"
          required
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="frequency" className="block text-sm font-medium mb-1">
          Frequency
        </label>
        <select
          id="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as Frequency)}
          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Color</label>
        <div className="flex space-x-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`w-8 h-8 rounded-full ${c} ${
                color === c ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Add Habit
        </button>
      </div>
    </form>
  );
};

export default AddHabitForm; 
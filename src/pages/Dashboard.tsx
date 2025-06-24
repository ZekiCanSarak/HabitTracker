import { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import HabitList from '../components/HabitList';
import AddHabitForm from '../components/AddHabitForm';
import { PlusIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const { habits } = useHabits();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Habits</h1>
        <button
          onClick={() => setIsAddingHabit(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Habit</span>
        </button>
      </div>

      {isAddingHabit && (
        <div className="card">
          <AddHabitForm onClose={() => setIsAddingHabit(false)} />
        </div>
      )}

      {habits.length === 0 && !isAddingHabit ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            You haven't created any habits yet. Click the "Add Habit" button to get started!
          </p>
        </div>
      ) : (
        <HabitList />
      )}
    </div>
  );
};

export default Dashboard; 
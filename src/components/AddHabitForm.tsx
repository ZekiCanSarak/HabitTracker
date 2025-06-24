import { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Frequency, Category, Reminder } from '../types/habit';
import Select from 'react-select';

interface AddHabitFormProps {
  onClose: () => void;
}

const COLORS = [
  '#ef4444', // red
  '#f59e0b', // yellow
  '#10b981', // green
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // purple
  '#ec4899', // pink
];

const DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const AddHabitForm = ({ onClose }: AddHabitFormProps) => {
  const { addHabit } = useHabits();
  const { translate } = useLocalization();
  const { hasPermission, requestPermission } = useNotifications();
  const { currentTheme } = useTheme();
  
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [category, setCategory] = useState<Category>('other');
  const [color, setColor] = useState(COLORS[0]);
  const [reminder, setReminder] = useState<Reminder>({
    enabled: false,
    time: '09:00',
    days: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Request notification permission if reminder is enabled
    if (reminder.enabled && !hasPermission) {
      await requestPermission();
    }

    addHabit({
      name: name.trim(),
      frequency,
      category,
      color,
      reminder,
    });
    onClose();
  };

  const handleReminderToggle = (enabled: boolean) => {
    setReminder(prev => ({ ...prev, enabled }));
    if (enabled && !hasPermission) {
      requestPermission();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{translate('habit.new')}</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:opacity-75 transition-opacity"
          style={{ color: currentTheme.colors.text }}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          {translate('habit.name')}
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg"
          placeholder={translate('habit.name')}
          required
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="frequency" className="block text-sm font-medium mb-1">
          {translate('habit.frequency')}
        </label>
        <select
          id="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as Frequency)}
          className="w-full px-3 py-2 rounded-lg"
        >
          <option value="daily">{translate('habit.frequency.daily')}</option>
          <option value="weekly">{translate('habit.frequency.weekly')}</option>
        </select>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          {translate('habit.category')}
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="w-full px-3 py-2 rounded-lg"
        >
          <option value="fitness">{translate('habit.category.fitness')}</option>
          <option value="study">{translate('habit.category.study')}</option>
          <option value="self-care">{translate('habit.category.selfcare')}</option>
          <option value="work">{translate('habit.category.work')}</option>
          <option value="health">{translate('habit.category.health')}</option>
          <option value="other">{translate('habit.category.other')}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{translate('habit.color')}</label>
        <div className="flex space-x-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`w-8 h-8 rounded-full transition-shadow ${
                color === c ? 'color-picker-ring' : ''
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="reminder-enabled"
            checked={reminder.enabled}
            onChange={(e) => handleReminderToggle(e.target.checked)}
            className="h-4 w-4 rounded"
            style={{ 
              accentColor: currentTheme.colors.primary,
              borderColor: currentTheme.colors.secondary
            }}
          />
          <label htmlFor="reminder-enabled" className="ml-2 block text-sm font-medium">
            {translate('habit.reminder')}
          </label>
        </div>

        {reminder.enabled && (
          <>
            <div>
              <label htmlFor="reminder-time" className="block text-sm font-medium mb-1">
                {translate('habit.reminder.time')}
              </label>
              <input
                type="time"
                id="reminder-time"
                value={reminder.time}
                onChange={(e) => setReminder(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {translate('habit.reminder.days')}
              </label>
              <Select
                isMulti
                options={DAYS}
                value={DAYS.filter(day => reminder.days?.includes(day.value))}
                onChange={(selected) => {
                  setReminder(prev => ({
                    ...prev,
                    days: selected.map(option => option.value)
                  }));
                }}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
        >
          {translate('action.cancel')}
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {translate('action.add')}
        </button>
      </div>
    </form>
  );
};

export default AddHabitForm; 
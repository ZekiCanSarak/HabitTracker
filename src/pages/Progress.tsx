import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useHabits } from '../contexts/HabitContext';
import { format, startOfMonth, eachDayOfInterval, endOfMonth } from 'date-fns';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-900 dark:text-white font-medium">{label}</p>
        <p className="text-gray-900 dark:text-white">
          Completion Rate: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const Progress = () => {
  const { habits, completions } = useHabits();

  const monthlyData = useMemo(() => {
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayCompletions = habits.map((habit) =>
        completions.some(
          (c) => c.habitId === habit.id && c.date === dateStr && c.completed
        )
      );

      return {
        date: format(day, 'MMM d'),
        completionRate: Math.round(
          (dayCompletions.filter(Boolean).length / habits.length) * 100
        ) || 0,
      };
    });
  }, [habits, completions]);

  const habitStats = useMemo(() => {
    return habits.map((habit) => {
      const habitCompletions = completions.filter(
        (c) => c.habitId === habit.id && c.completed
      );

      return {
        name: habit.name,
        color: habit.color,
        completionCount: habitCompletions.length,
        completionRate: Math.round(
          (habitCompletions.length / monthlyData.length) * 100
        ),
      };
    });
  }, [habits, completions, monthlyData.length]);

  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Monthly Progress</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="completionRate"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Habit Statistics</h2>
        <div className="space-y-4">
          {habitStats.map((stat) => (
            <div key={stat.name} className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                  <span className="font-medium">{stat.name}</span>
                </div>
                <div className="mt-1 flex space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{stat.completionCount} completions</span>
                  <span>{stat.completionRate}% success rate</span>
                </div>
              </div>
              <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stat.color}`}
                  style={{ width: `${stat.completionRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress; 
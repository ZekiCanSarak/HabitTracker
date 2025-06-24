import { createContext, useContext, useState, useEffect } from 'react';
import { Habit } from '../types/habit';

interface NotificationContextType {
  hasPermission: boolean;
  requestPermission: () => Promise<void>;
  scheduleNotification: (habit: Habit) => void;
  cancelNotification: (habitId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Check if the browser supports notifications
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    const permission = await Notification.requestPermission();
    setHasPermission(permission === 'granted');
  };

  const scheduleNotification = (habit: Habit) => {
    if (!hasPermission || !habit.reminder.enabled || !habit.reminder.time) {
      return;
    }

    // Clear any existing notification for this habit
    cancelNotification(habit.id);

    // Schedule the notification
    const [hours, minutes] = habit.reminder.time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime.getTime() < now.getTime()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    // Store the timeout ID in localStorage to persist across page reloads
    const timeoutId = setTimeout(() => {
      if (habit.reminder.days?.length) {
        const today = new Date().getDay();
        if (!habit.reminder.days.includes(today)) {
          // Reschedule for tomorrow if today is not a reminder day
          scheduleNotification(habit);
          return;
        }
      }

      new Notification('Habit Reminder', {
        body: `Time to complete your habit: ${habit.name}`,
        icon: '/favicon.ico',
      });

      // Reschedule for tomorrow
      scheduleNotification(habit);
    }, timeUntilNotification);

    const notifications = JSON.parse(localStorage.getItem('notifications') || '{}');
    notifications[habit.id] = timeoutId;
    localStorage.setItem('notifications', JSON.stringify(notifications));
  };

  const cancelNotification = (habitId: string) => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '{}');
    if (notifications[habitId]) {
      clearTimeout(notifications[habitId]);
      delete notifications[habitId];
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  };

  // Reschedule notifications on page load
  useEffect(() => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '{}');
    Object.keys(notifications).forEach(habitId => {
      clearTimeout(notifications[habitId]);
    });
    localStorage.setItem('notifications', JSON.stringify({}));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        hasPermission,
        requestPermission,
        scheduleNotification,
        cancelNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}; 
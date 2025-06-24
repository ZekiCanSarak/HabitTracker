import { createContext, useContext, useState, useEffect } from 'react';
import { 
  Habit, 
  HabitCompletion, 
  Profile, 
  UndoableAction, 
  HabitStats, 
  Badge 
} from '../types/habit';

interface HabitContextType {
  habits: Habit[];
  completions: HabitCompletion[];
  currentProfile: Profile;
  profiles: Profile[];
  undoStack: UndoableAction[];
  redoStack: UndoableAction[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'stats' | 'badges' | 'order'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (habitId: string, date: string) => void;
  switchProfile: (profileId: string) => void;
  addProfile: (name: string) => void;
  updateProfile: (profile: Profile) => void;
  reorderHabits: (startIndex: number, endIndex: number) => void;
  undo: () => void;
  redo: () => void;
  calculateStats: (habitId: string) => HabitStats;
  earnBadge: (habitId: string, badge: Omit<Badge, 'id' | 'earnedAt'>) => void;
}

const HabitContext = createContext<HabitContextType | null>(null);

const STORAGE_KEY = 'habitTracker';

interface StorageData {
  habits: Habit[];
  completions: HabitCompletion[];
  profiles: Profile[];
  currentProfileId: string;
}

const defaultProfile: Profile = {
  id: 'default',
  name: 'Default Profile',
  createdAt: new Date().toISOString(),
  preferences: {
    theme: 'light',
    language: 'en'
  }
};

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
  const [profiles, setProfiles] = useState<Profile[]>([defaultProfile]);
  const [currentProfile, setCurrentProfile] = useState<Profile>(defaultProfile);
  const [undoStack, setUndoStack] = useState<UndoableAction[]>([]);
  const [redoStack, setRedoStack] = useState<UndoableAction[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const data: StorageData = JSON.parse(storedData);
      setHabits(data.habits);
      setCompletions(data.completions);
      setProfiles(data.profiles);
      const profile = data.profiles.find(p => p.id === data.currentProfileId) || defaultProfile;
      setCurrentProfile(profile);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const data: StorageData = {
      habits,
      completions,
      profiles,
      currentProfileId: currentProfile.id
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [habits, completions, profiles, currentProfile]);

  const addToUndoStack = (action: UndoableAction) => {
    setUndoStack(prev => [...prev, action]);
    setRedoStack([]); // Clear redo stack when new action is performed
  };

  const calculateStats = (habitId: string): HabitStats => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) {
      return {
        longestStreak: 0,
        currentStreak: 0,
        totalCompletions: 0,
        level: 1,
        xp: 0
      };
    }

    const habitCompletions = completions
      .filter(c => c.habitId === habitId && c.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalCompletions = habitCompletions.length;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate streaks
    for (let i = 0; i < habitCompletions.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const curr = new Date(habitCompletions[i].date);
        const prev = new Date(habitCompletions[i - 1].date);
        const diffDays = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          tempStreak = 1;
        }
      }
    }

    currentStreak = tempStreak;
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    // Calculate level and XP
    const xp = totalCompletions * 10 + (currentStreak * 5);
    const level = Math.floor(xp / 100) + 1;

    return {
      longestStreak,
      currentStreak,
      totalCompletions,
      level,
      xp
    };
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'stats' | 'badges' | 'order'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      order: habits.length,
      stats: {
        longestStreak: 0,
        currentStreak: 0,
        totalCompletions: 0,
        level: 1,
        xp: 0
      },
      badges: []
    };
    
    setHabits(prev => [...prev, newHabit]);
    addToUndoStack({
      type: 'ADD',
      payload: newHabit,
      timestamp: Date.now()
    });
  };

  const updateHabit = (updatedHabit: Habit) => {
    const oldHabit = habits.find(h => h.id === updatedHabit.id);
    setHabits(prev => prev.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    ));
    
    if (oldHabit) {
      addToUndoStack({
        type: 'UPDATE',
        payload: { old: oldHabit, new: updatedHabit },
        timestamp: Date.now()
      });
    }
  };

  const deleteHabit = (id: string) => {
    const habitToDelete = habits.find(h => h.id === id);
    const relatedCompletions = completions.filter(c => c.habitId === id);
    
    setHabits(prev => prev.filter(habit => habit.id !== id));
    setCompletions(prev => prev.filter(completion => completion.habitId !== id));
    
    if (habitToDelete) {
      addToUndoStack({
        type: 'DELETE',
        payload: { habit: habitToDelete, completions: relatedCompletions },
        timestamp: Date.now()
      });
    }
  };

  const toggleCompletion = (habitId: string, date: string) => {
    setCompletions(prev => {
      const existingCompletion = prev.find(
        c => c.habitId === habitId && c.date === date
      );

      let newCompletions;
      if (existingCompletion) {
        newCompletions = prev.map(c =>
          c.habitId === habitId && c.date === date
            ? { ...c, completed: !c.completed }
            : c
        );
      } else {
        newCompletions = [...prev, { habitId, date, completed: true }];
      }

      // Update habit stats
      const habit = habits.find(h => h.id === habitId);
      if (habit) {
        const newStats = calculateStats(habitId);
        updateHabit({ ...habit, stats: newStats });
      }

      return newCompletions;
    });
  };

  const switchProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setCurrentProfile(profile);
    }
  };

  const addProfile = (name: string) => {
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'light',
        language: 'en'
      }
    };
    setProfiles(prev => [...prev, newProfile]);
  };

  const updateProfile = (updatedProfile: Profile) => {
    setProfiles(prev => prev.map(profile =>
      profile.id === updatedProfile.id ? updatedProfile : profile
    ));
    if (currentProfile.id === updatedProfile.id) {
      setCurrentProfile(updatedProfile);
    }
  };

  const reorderHabits = (startIndex: number, endIndex: number) => {
    const reorderedHabits = Array.from(habits);
    const [removed] = reorderedHabits.splice(startIndex, 1);
    reorderedHabits.splice(endIndex, 0, removed);
    
    // Update order property for all affected habits
    const updatedHabits = reorderedHabits.map((habit, index) => ({
      ...habit,
      order: index
    }));
    
    setHabits(updatedHabits);
  };

  const undo = () => {
    const action = undoStack[undoStack.length - 1];
    if (!action) return;

    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, action]);

    switch (action.type) {
      case 'ADD':
        setHabits(prev => prev.filter(h => h.id !== action.payload.id));
        break;
      case 'UPDATE':
        setHabits(prev => prev.map(h => 
          h.id === action.payload.old.id ? action.payload.old : h
        ));
        break;
      case 'DELETE':
        setHabits(prev => [...prev, action.payload.habit]);
        setCompletions(prev => [...prev, ...action.payload.completions]);
        break;
      case 'TOGGLE':
        toggleCompletion(action.payload.habitId, action.payload.date);
        break;
    }
  };

  const redo = () => {
    const action = redoStack[redoStack.length - 1];
    if (!action) return;

    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, action]);

    switch (action.type) {
      case 'ADD':
        setHabits(prev => [...prev, action.payload]);
        break;
      case 'UPDATE':
        setHabits(prev => prev.map(h => 
          h.id === action.payload.new.id ? action.payload.new : h
        ));
        break;
      case 'DELETE':
        setHabits(prev => prev.filter(h => h.id !== action.payload.habit.id));
        setCompletions(prev => prev.filter(c => c.habitId !== action.payload.habit.id));
        break;
      case 'TOGGLE':
        toggleCompletion(action.payload.habitId, action.payload.date);
        break;
    }
  };

  const earnBadge = (habitId: string, badgeData: Omit<Badge, 'id' | 'earnedAt'>) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const newBadge: Badge = {
      ...badgeData,
      id: crypto.randomUUID(),
      earnedAt: new Date().toISOString()
    };

    const updatedHabit = {
      ...habit,
      badges: [...habit.badges, newBadge]
    };

    updateHabit(updatedHabit);
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        completions,
        currentProfile,
        profiles,
        undoStack,
        redoStack,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleCompletion,
        switchProfile,
        addProfile,
        updateProfile,
        reorderHabits,
        undo,
        redo,
        calculateStats,
        earnBadge,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}; 
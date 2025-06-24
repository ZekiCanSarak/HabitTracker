import { createContext, useContext, useEffect } from 'react';
import { useHabits } from './HabitContext';

interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    cardBackground: string;
    text: string;
    accent: string;
  };
}

interface ThemeContextType {
  currentTheme: Theme;
  availableThemes: Theme[];
  setTheme: (themeId: string) => void;
  addCustomTheme: (theme: Omit<Theme, 'id'>) => void;
  deleteCustomTheme: (themeId: string) => void;
}

const defaultThemes: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    colors: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      background: '#f3f4f6',
      cardBackground: '#ffffff',
      text: '#1f2937',
      accent: '#f59e0b',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    colors: {
      primary: '#60a5fa',
      secondary: '#3b82f6',
      background: '#111827',
      cardBackground: '#1f2937',
      text: '#f3f4f6',
      accent: '#fbbf24',
    },
  },
  {
    id: 'nature',
    name: 'Nature',
    colors: {
      primary: '#059669',
      secondary: '#34d399',
      background: '#f0fdf4',
      cardBackground: '#ffffff',
      text: '#064e3b',
      accent: '#f59e0b',
    },
  },
];

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentProfile, updateProfile } = useHabits();
  const storedThemesStr = localStorage.getItem('customThemes');
  const storedThemes: Theme[] = storedThemesStr ? JSON.parse(storedThemesStr) : [];
  const allThemes = [...defaultThemes, ...storedThemes];
  const currentTheme = allThemes.find(theme => theme.id === currentProfile.preferences.theme) || defaultThemes[0];

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    const theme = allThemes.find(t => t.id === themeId);
    if (!theme) return;

    const updatedProfile = {
      ...currentProfile,
      preferences: {
        ...currentProfile.preferences,
        theme: themeId,
      },
    };
    updateProfile(updatedProfile);
  };

  const addCustomTheme = (theme: Omit<Theme, 'id'>) => {
    const newTheme: Theme = {
      ...theme,
      id: crypto.randomUUID(),
    };

    const customThemes = [...storedThemes, newTheme];
    localStorage.setItem('customThemes', JSON.stringify(customThemes));
  };

  const deleteCustomTheme = (themeId: string) => {
    const customThemes = storedThemes.filter((theme: Theme) => theme.id !== themeId);
    localStorage.setItem('customThemes', JSON.stringify(customThemes));

    // If the deleted theme was active, switch to default
    if (currentTheme.id === themeId) {
      setTheme(defaultThemes[0].id);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        availableThemes: allThemes,
        setTheme,
        addCustomTheme,
        deleteCustomTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}; 
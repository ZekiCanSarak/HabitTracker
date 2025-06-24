import { createContext, useContext } from 'react';
import { useHabits } from './HabitContext';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

interface LocalizationContextType {
  currentLanguage: string;
  translate: (key: string) => string;
  setLanguage: (language: string) => void;
  availableLanguages: string[];
}

const translations: Translations = {
  en: {
    // General
    'app.title': 'Habit Tracker',
    'app.description': 'Track your daily and weekly habits',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.progress': 'Progress',
    'nav.settings': 'Settings',
    
    // Actions
    'action.add': 'Add',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.confirm': 'Confirm',
    
    // Habits
    'habit.new': 'New Habit',
    'habit.name': 'Habit Name',
    'habit.frequency': 'Frequency',
    'habit.frequency.daily': 'Daily',
    'habit.frequency.weekly': 'Weekly',
    'habit.category': 'Category',
    'habit.category.fitness': 'Fitness',
    'habit.category.study': 'Study',
    'habit.category.selfcare': 'Self-care',
    'habit.category.work': 'Work',
    'habit.category.health': 'Health',
    'habit.category.other': 'Other',
    'habit.color': 'Color',
    'habit.reminder': 'Reminder',
    'habit.reminder.time': 'Time',
    'habit.reminder.days': 'Days',
    
    // Stats
    'stats.streak': 'Current Streak',
    'stats.longest_streak': 'Longest Streak',
    'stats.total_completions': 'Total Completions',
    'stats.completion_rate': 'Completion Rate',
    'stats.level': 'Level',
    'stats.xp': 'XP',
    
    // Settings
    'settings.profile': 'Profile',
    'settings.profile.new': 'Enter profile name',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    
    // Messages
    'message.confirm_delete': 'Are you sure you want to delete this habit?',
    'message.no_habits': 'No habits yet. Add your first habit to get started!',
    'message.habit_added': 'Habit added successfully',
    'message.habit_updated': 'Habit updated successfully',
    'message.habit_deleted': 'Habit deleted successfully',
  },
  tr: {
    // General
    'app.title': 'Alışkanlık Takibi',
    'app.description': 'Günlük ve haftalık alışkanlıklarınızı takip edin',
    
    // Navigation
    'nav.dashboard': 'Panel',
    'nav.progress': 'İlerleme',
    'nav.settings': 'Ayarlar',
    
    // Actions
    'action.add': 'Ekle',
    'action.edit': 'Düzenle',
    'action.delete': 'Sil',
    'action.save': 'Kaydet',
    'action.cancel': 'İptal',
    'action.confirm': 'Onayla',
    
    // Habits
    'habit.new': 'Yeni Alışkanlık',
    'habit.name': 'Alışkanlık Adı',
    'habit.frequency': 'Sıklık',
    'habit.frequency.daily': 'Günlük',
    'habit.frequency.weekly': 'Haftalık',
    'habit.category': 'Kategori',
    'habit.category.fitness': 'Fitness',
    'habit.category.study': 'Çalışma',
    'habit.category.selfcare': 'Kişisel Bakım',
    'habit.category.work': 'İş',
    'habit.category.health': 'Sağlık',
    'habit.category.other': 'Diğer',
    'habit.color': 'Renk',
    'habit.reminder': 'Hatırlatıcı',
    'habit.reminder.time': 'Zaman',
    'habit.reminder.days': 'Günler',
    
    // Stats
    'stats.streak': 'Mevcut Seri',
    'stats.longest_streak': 'En Uzun Seri',
    'stats.total_completions': 'Toplam Tamamlama',
    'stats.completion_rate': 'Tamamlama Oranı',
    'stats.level': 'Seviye',
    'stats.xp': 'TP',
    
    // Settings
    'settings.profile': 'Profil',
    'settings.profile.new': 'Profil adını girin',
    'settings.theme': 'Tema',
    'settings.language': 'Dil',
    'settings.notifications': 'Bildirimler',
    
    // Messages
    'message.confirm_delete': 'Bu alışkanlığı silmek istediğinizden emin misiniz?',
    'message.no_habits': 'Henüz alışkanlık yok. Başlamak için ilk alışkanlığınızı ekleyin!',
    'message.habit_added': 'Alışkanlık başarıyla eklendi',
    'message.habit_updated': 'Alışkanlık başarıyla güncellendi',
    'message.habit_deleted': 'Alışkanlık başarıyla silindi',
  },
};

const LocalizationContext = createContext<LocalizationContextType | null>(null);

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

export const LocalizationProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentProfile, updateProfile } = useHabits();
  const currentLanguage = currentProfile.preferences.language || 'en';

  const translate = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const setLanguage = (language: string) => {
    if (translations[language]) {
      const updatedProfile = {
        ...currentProfile,
        preferences: {
          ...currentProfile.preferences,
          language,
        },
      };
      updateProfile(updatedProfile);
    }
  };

  return (
    <LocalizationContext.Provider
      value={{
        currentLanguage,
        translate,
        setLanguage,
        availableLanguages: Object.keys(translations),
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
}; 
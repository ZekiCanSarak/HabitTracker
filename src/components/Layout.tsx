import { Link, useLocation } from 'react-router-dom';
import {
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { useHabits } from '../contexts/HabitContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useState } from 'react';
import Select from 'react-select';

interface LayoutProps {
  children: React.ReactNode;
}

interface ThemeOption {
  value: string;
  label: string;
}

const Layout = ({ children }: LayoutProps) => {
  const { currentTheme, availableThemes, setTheme } = useTheme();
  const { currentLanguage, availableLanguages, setLanguage, translate } = useLocalization();
  const { currentProfile, profiles, addProfile, switchProfile } = useHabits();
  const { hasPermission, requestPermission } = useNotifications();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const themeOptions: ThemeOption[] = availableThemes.map(theme => ({
    value: theme.id,
    label: theme.name,
  }));

  const languageOptions = availableLanguages.map(lang => ({
    value: lang,
    label: lang === 'en' ? 'English' : 'Türkçe',
  }));

  const profileOptions = profiles.map(profile => ({
    value: profile.id,
    label: profile.name,
  }));

  const handleAddProfile = () => {
    const name = prompt(translate('settings.profile.new'));
    if (name) {
      addProfile(name);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="shadow-sm" style={{ backgroundColor: currentTheme.colors.background }}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  location.pathname === '/' ? 'border-b-2' : ''
                }`}
                style={{ 
                  borderColor: location.pathname === '/' ? currentTheme.colors.primary : 'transparent',
                  color: currentTheme.colors.text
                }}
              >
                {translate('nav.dashboard')}
              </Link>
              <Link
                to="/progress"
                className={`ml-8 inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  location.pathname === '/progress' ? 'border-b-2' : ''
                }`}
                style={{ 
                  borderColor: location.pathname === '/progress' ? currentTheme.colors.primary : 'transparent',
                  color: currentTheme.colors.text
                }}
              >
                {translate('nav.progress')}
              </Link>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => !hasPermission && requestPermission()}
                className="p-2 rounded-md hover:bg-opacity-75 transition-colors"
                style={{ backgroundColor: hasPermission ? currentTheme.colors.primary : currentTheme.colors.secondary }}
              >
                <BellIcon className="h-6 w-6 text-white" />
              </button>

              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="ml-4 p-2 rounded-md hover:bg-opacity-75 transition-colors"
                style={{ backgroundColor: currentTheme.colors.secondary }}
              >
                <Cog6ToothIcon className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {isSettingsOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div 
            className="card w-96 p-6"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">{translate('nav.settings')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {translate('settings.profile')}
                </label>
                <div className="flex gap-2">
                  <Select
                    className="react-select-container flex-1"
                    classNamePrefix="react-select"
                    value={profileOptions.find(option => option.value === currentProfile.id)}
                    onChange={option => option && switchProfile(option.value)}
                    options={profileOptions}
                  />
                  <button
                    onClick={handleAddProfile}
                    className="p-2 rounded-md hover:bg-opacity-75 transition-colors"
                    style={{ backgroundColor: currentTheme.colors.accent }}
                  >
                    <UserCircleIcon className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {translate('settings.theme')}
                </label>
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  value={themeOptions.find(option => option.value === currentTheme.id)}
                  onChange={option => option && setTheme(option.value)}
                  options={themeOptions}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {translate('settings.language')}
                </label>
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  value={languageOptions.find(option => option.value === currentLanguage)}
                  onChange={option => option && setLanguage(option.value)}
                  options={languageOptions}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            {translate('app.description')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 
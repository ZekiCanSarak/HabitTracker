import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HabitProvider } from './contexts/HabitContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';

// Configure future flags for React Router v7
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

// Get the base URL from Vite's environment
const base = import.meta.env.BASE_URL;

function App() {
  return (
    <HabitProvider>
      <ThemeProvider>
        <LocalizationProvider>
          <NotificationProvider>
            <Router basename={base} {...router}>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/progress" element={<Progress />} />
                  {/* Redirect any unknown routes to Dashboard */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </Router>
          </NotificationProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </HabitProvider>
  );
}

export default App; 
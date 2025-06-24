import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <HabitProvider>
      <ThemeProvider>
        <LocalizationProvider>
          <NotificationProvider>
            <Router {...router}>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/progress" element={<Progress />} />
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
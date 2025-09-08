import { useState } from 'react';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import StudyModule from './components/StudyModule';
import TasksPage from './components/TasksPage';
import AchievementsPage from './components/AchievementsPage';

export type UserType = 'kids' | 'adults' | null;
export type CurrentPage = 'login' | 'landing' | 'dashboard' | 'study' | 'tasks' | 'achievements';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [currentPage, setCurrentPage] = useState<CurrentPage>('login');
  const [user, setUser] = useState<any>(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentPage('landing');
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setCurrentPage('dashboard');
  };

  const navigateTo = (page: CurrentPage) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    if (!isLoggedIn) {
      return <LoginPage onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage onUserTypeSelect={handleUserTypeSelect} />;
      case 'dashboard':
        return <Dashboard userType={userType} user={user} onNavigate={navigateTo} />;
      case 'study':
        return <StudyModule userType={userType} onNavigate={navigateTo} />;
      case 'tasks':
        return <TasksPage userType={userType} onNavigate={navigateTo} />;
      case 'achievements':
        return <AchievementsPage userType={userType} user={user} onNavigate={navigateTo} />;
      default:
        return <LandingPage onUserTypeSelect={handleUserTypeSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {renderCurrentPage()}
    </div>
  );
}

export default App;
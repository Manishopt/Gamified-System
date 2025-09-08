import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import StudyModule from './components/StudyModule';
import TasksPage from './components/TasksPage';
import AchievementsPage from './components/AchievementsPage';
import Task1 from './components/Task1';
import Leaderboard from './components/Leaderboard';
import Learning from './components/Learning';

export type UserType = 'kids' | 'adults' | null;
export type CurrentPage = 'login' | 'landing' | 'dashboard' | 'study' | 'tasks' | 'achievements' | 'task1' | 'leaderboard' | '/study/water-conservation';

type ProtectedRouteProps = {
  children: React.ReactNode;
  userType: UserType | null;
  isLoggedIn: boolean;
};

const ProtectedRoute = ({ children, userType, isLoggedIn }: ProtectedRouteProps) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (!userType) {
    return <Navigate to="/landing" replace />;
  }
  return <>{children}</>;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userType, setUserType] = useState<UserType>(() => {
    return localStorage.getItem('userType') as UserType || null;
  });
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();
  // Location is available if needed for future use
  // const location = useLocation();

  useEffect(() => {
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
    if (userType) {
      localStorage.setItem('userType', userType);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [isLoggedIn, userType, user]);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
    navigate('/landing');
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Routes>
        <Route path="/login" element={
          isLoggedIn ? 
            <Navigate to="/dashboard" replace /> : 
            <LoginPage onLogin={handleLogin} />
        } />
        
        <Route path="/landing" element={
          isLoggedIn ? (
            <LandingPage onUserTypeSelect={handleUserTypeSelect} />
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute userType={userType} isLoggedIn={isLoggedIn}>
            <Dashboard userType={userType} user={user} onNavigate={navigate} />
          </ProtectedRoute>
        } />

        <Route path="/study" element={
          <ProtectedRoute userType={userType} isLoggedIn={isLoggedIn}>
            <Outlet />
          </ProtectedRoute>
        }>
          <Route index element={
            <StudyModule userType={userType} />
          } />
          <Route path="water-conservation" element={
            <Learning userType={userType} />
          } />
        </Route>

        <Route path="/tasks" element={
          <ProtectedRoute userType={userType} isLoggedIn={isLoggedIn}>
            <TasksPage userType={userType} onNavigate={navigate} />
          </ProtectedRoute>
        } />

        <Route path="/achievements" element={
          <ProtectedRoute userType={userType} isLoggedIn={isLoggedIn}>
            <AchievementsPage userType={userType} onNavigate={navigate} />
          </ProtectedRoute>
        } />

        <Route path="/leaderboard" element={
          <ProtectedRoute userType={userType} isLoggedIn={isLoggedIn}>
            <Leaderboard onNavigate={navigate} />
          </ProtectedRoute>
        } />

        <Route path="/task1" element={
          <ProtectedRoute userType={userType} isLoggedIn={isLoggedIn}>
            <Task1 userType={userType} onNavigate={navigate} />
          </ProtectedRoute>
        } />

        <Route path="/" element={
          isLoggedIn ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" replace />
        } />

        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-xl">Page not found</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Home
              </button>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
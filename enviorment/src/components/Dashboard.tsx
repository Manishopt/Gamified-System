import { BookOpen, Target, Trophy, TrendingUp, Star, Flame } from 'lucide-react';
import type { UserType } from '../App';
type CurrentPage = 'login' | 'landing' | 'dashboard' | 'study' | 'tasks' | 'achievements' | 'task1';
import ProgressBar from './ProgressBar';

interface DashboardProps {
  userType: UserType;
  user: any;
  onNavigate: (page: CurrentPage) => void;
}

export default function Dashboard({ userType, user, onNavigate }: DashboardProps) {
  // Ensure points is a number and calculate progress percentage (capped at 100%)
  const userPoints = Number(user.points) || 120;
  const progressWidth = Math.min((userPoints / 200) * 100, 100);
  
  const navigationItems = userType === 'kids'
    ? [
        { icon: BookOpen, title: 'Study', subtitle: 'Learn & Play', page: 'study' as CurrentPage, color: 'from-green-400 to-blue-400' },
        { icon: Target, title: 'Tasks', subtitle: 'Eco Missions', page: 'tasks' as CurrentPage, color: 'from-blue-400 to-purple-400' },
        { icon: Trophy, title: 'Leaderboard', subtitle: 'Top Performers', page: 'leaderboard' as CurrentPage, color: 'from-purple-400 to-pink-400' }
      ]
    : [
        { icon: BookOpen, title: 'Projects', subtitle: 'Real Impact', page: 'study' as CurrentPage, color: 'from-green-500 to-teal-500' },
        { icon: Target, title: 'Challenges', subtitle: 'Advanced Tasks', page: 'tasks' as CurrentPage, color: 'from-teal-500 to-blue-500' },
        { icon: Trophy, title: 'Leaderboard', subtitle: 'Top Performers', page: 'leaderboard' as CurrentPage, color: 'from-blue-500 to-indigo-500' }
      ];

  return (
    <div className="min-h-screen p-4 lg:p-8 relative">
      {/* Progress Bar Component */}
      <ProgressBar user={{
        points: user.points,
        streak: user.streak || 0,
        badges: user.badges || 0,
        timeSpent: 45,
        leaderboardPosition: 12
      }} />
      
      {/* Back to Landing Button - In the green background area */}
      <div className="max-w-6xl mx-auto mb-4">
        <button 
          onClick={() => onNavigate('landing')}
          className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg shadow-md transition-colors duration-200 flex items-center space-x-2 border border-gray-200"
        >
          <span>←</span>
          <span>Back to Landing</span>
        </button>
      </div>
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user.name}!</h1>
                <p className="text-gray-600">Ready to continue your eco-journey?</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl mb-1">
                {userType === 'kids' ? '🌟' : '🎯'}
              </div>
              <div className="text-sm text-gray-500">{userType === 'kids' ? 'Young Hero' : 'Eco Leader'}</div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* User Profile Card */}
            <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-xl">{user.name[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-semibold text-lg">{user.name}</p>
                  <p className="text-sm text-gray-600">Level {user.level || 1}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                <span className="text-sm font-medium">{user.points || 10} points</span>
              </div>
            </div>

            {/* Badges Earned */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Badges Earned</p>
                  <p className="text-2xl font-bold text-gray-800">{user.badges || 2}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-purple-600">Earn more by completing tasks</p>
            </div>

            {/* Day Streak */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Day Streak</p>
                  <p className="text-2xl font-bold text-gray-800">{user.streak || 3} days</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-yellow-600">Visit daily to keep your streak!</p>
            </div>

            {/* Current Level */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Level</p>
                  <p className="text-2xl font-bold text-gray-800">Level {user.level || 1}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min((userPoints / 200) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{userPoints}/200 XP to next level</p>
            </div>
          </div>

          {/* Level Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium text-gray-700`}>Level Progress</span>
              <span className="text-sm font-medium text-gray-700">{user.points || 0}/200 XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2`}
                style={{ width: `${progressWidth}%`, minWidth: '0.75rem' }}
              >
                {progressWidth > 30 && (
                  <span className="text-white text-[10px] font-bold">{Math.round(progressWidth)}%</span>
                )}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Eco-Warrior</span>
              <span>Next: Eco-Hero</span>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {navigationItems.map((item) => (
            <button
              key={item.title}
              onClick={() => onNavigate(item.page)}
              className={`group relative p-10 rounded-3xl shadow-xl bg-gradient-to-r ${item.color} text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden h-64 flex flex-col items-center justify-center`}
            >
              <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              <div className="relative z-10 text-center px-4">
                <item.icon className="w-16 h-16 mb-6 group-hover:animate-bounce mx-auto" />
                <h3 className="text-3xl font-bold mb-3">{item.title}</h3>
                <p className="text-white text-opacity-90 text-lg">{item.subtitle}</p>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-6 right-6 text-5xl opacity-20 group-hover:opacity-40 transition-opacity">
                {item.title === 'Study' || item.title === 'Projects' ? '📚' : 
                 item.title === 'Tasks' || item.title === 'Challenges' ? '🎯' : '🏆'}
              </div>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Today's Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-4xl mb-2">🌱</div>
              <h3 className="font-semibold text-gray-800">Lessons Completed</h3>
              <p className="text-2xl font-bold text-green-600">3</p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-4xl mb-2">💧</div>
              <h3 className="font-semibold text-gray-800">Eco-Tasks Done</h3>
              <p className="text-2xl font-bold text-blue-600">2</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-4xl mb-2">⭐</div>
              <h3 className="font-semibold text-gray-800">Points Earned</h3>
              <p className="text-2xl font-bold text-purple-600">45</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { BookOpen, Target, Trophy, User, TrendingUp, Star, Flame } from 'lucide-react';
import type { UserType, CurrentPage } from '../App';

interface DashboardProps {
  userType: UserType;
  user: any;
  onNavigate: (page: CurrentPage) => void;
}

export default function Dashboard({ userType, user, onNavigate }: DashboardProps) {
  const progressWidth = (user.points / 200) * 100;
  
  const menuItems = userType === 'kids' 
    ? [
        { icon: BookOpen, title: 'Study', subtitle: 'Learn & Play', page: 'study' as CurrentPage, color: 'from-green-400 to-blue-400' },
        { icon: Target, title: 'Tasks', subtitle: 'Eco Missions', page: 'tasks' as CurrentPage, color: 'from-blue-400 to-purple-400' },
        { icon: Trophy, title: 'Achievements', subtitle: 'Rewards', page: 'achievements' as CurrentPage, color: 'from-purple-400 to-pink-400' }
      ]
    : [
        { icon: BookOpen, title: 'Projects', subtitle: 'Real Impact', page: 'study' as CurrentPage, color: 'from-green-500 to-teal-500' },
        { icon: Target, title: 'Challenges', subtitle: 'Advanced Tasks', page: 'tasks' as CurrentPage, color: 'from-teal-500 to-blue-500' },
        { icon: Trophy, title: 'Achievements', subtitle: 'Recognition', page: 'achievements' as CurrentPage, color: 'from-blue-500 to-indigo-500' }
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 lg:p-8">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-6 h-6 text-green-600" />
                <span className="text-2xl font-bold text-green-700">{user.points}</span>
              </div>
              <p className="text-sm text-green-600 font-medium">Total Points</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-6 h-6 text-blue-600" />
                <span className="text-2xl font-bold text-blue-700">{user.badges}</span>
              </div>
              <p className="text-sm text-blue-600 font-medium">Badges Earned</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <Flame className="w-6 h-6 text-orange-600" />
                <span className="text-2xl font-bold text-orange-700">{user.streak}</span>
              </div>
              <p className="text-sm text-orange-600 font-medium">Day Streak</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <span className="text-2xl font-bold text-purple-700">{user.level}</span>
              </div>
              <p className="text-sm text-purple-600 font-medium">Current Level</p>
            </div>
          </div>

          {/* Level Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Level Progress</span>
              <span className="text-sm text-gray-500">{user.points}/200 XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressWidth}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Eco-Warrior</span>
              <span>Next: Eco-Hero</span>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => onNavigate(item.page)}
              className={`group relative p-8 rounded-2xl shadow-xl bg-gradient-to-r ${item.color} text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden`}
            >
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              <div className="relative z-10">
                <item.icon className="w-12 h-12 mb-4 group-hover:animate-bounce" />
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-white text-opacity-90">{item.subtitle}</p>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                {item.title === 'Study' || item.title === 'Projects' ? '📚' : 
                 item.title === 'Tasks' || item.title === 'Challenges' ? '🎯' : '🏆'}
              </div>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
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
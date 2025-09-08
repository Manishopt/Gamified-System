import React, { useState } from 'react';
import { X, Activity, Zap, Trophy, Award as AwardIcon, Share2, Twitter, Facebook, Linkedin, MessageSquare } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProgressBarProps {
  user: {
    points: number;
    streak: number;
    badges: number;
    timeSpent: number; // in minutes
    leaderboardPosition: number;
  };
}

const ProgressBar: React.FC<ProgressBarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);


  // Chart data for XP Progress
  const xpChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'XP Gained',
        data: [30, 80, 120, 180],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Chart data for streaks
  const streakChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Activity',
        data: [3, 5, 4, 6, 8, 7, 9],
        backgroundColor: 'rgba(249, 115, 22, 0.6)',
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const progressItems = [
    {
      icon: <Activity className="w-5 h-5" />,
      title: "XP Progress",
      value: user.points,
      max: 200,
      color: "from-blue-400 to-purple-500",
      chart: (
        <div className="h-16 w-full mt-2">
          <Line data={xpChartData} options={chartOptions} />
        </div>
      )
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Daily Streak",
      value: user.streak,
      max: 30,
      color: "from-orange-400 to-red-500",
      chart: (
        <div className="h-16 w-full mt-2">
          <Bar data={streakChartData} options={chartOptions} />
        </div>
      )
    },
    {
      icon: <AwardIcon className="w-5 h-5" />,
      title: "Badges",
      value: user.badges,
      max: 10,
      color: "from-yellow-400 to-amber-500",
      chart: (
        <div className="flex justify-center space-x-2 mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full ${i < user.badges ? 'bg-yellow-400' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      )
    }
  ];

  return (
    <>
      {/* Blur overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Progress Button */}
      <div className="fixed right-4 top-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          aria-label="Progress Tracker"
        >
          <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
            <svg 
              className="w-4 h-4 group-hover:scale-110 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
              />
            </svg>
          </div>
        </button>
      </div>

      {/* Modal */}
      <div 
        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-95 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Your Progress Dashboard</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-100">Current Rank</p>
                <p className="text-2xl font-bold text-white">#{user.leaderboardPosition}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Total XP</p>
                <p className="text-2xl font-bold text-white">{user.points} XP</p>
              </div>
            </div>
          </div>
          
          {/* Progress Items */}
          <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
            {progressItems.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`bg-gradient-to-r ${item.color} text-white p-1.5 rounded-lg`}>
                      {item.icon}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                      <p className="text-xs text-gray-500">
                        {`${item.value} of ${item.max}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {Math.round((item.value / item.max) * 100)}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-3">
                  <div 
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                    style={{ 
                      width: `${Math.min((item.value / item.max) * 100, 100)}%` 
                    }}
                  />
                </div>
                
                {/* Chart */}
                {item.chart}
              </div>
            ))}
            
            {/* Leaderboard Section */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-purple-800 flex items-center">
                  <Trophy className="w-4 h-4 mr-2 text-purple-600" />
                  Leaderboard Position
                </h4>
                <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                  #{user.leaderboardPosition}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-purple-800 font-bold">#{user.leaderboardPosition - 1}</span>
                  </div>
                  <span className="text-gray-500">Above</span>
                </div>
                
                <div className="text-center -mt-2">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-1 shadow-lg">
                    <span className="text-white font-bold">You</span>
                  </div>
                  <span className="font-medium text-purple-700">#{user.leaderboardPosition}</span>
                </div>
                
                <div className="text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-purple-800 font-bold">#{user.leaderboardPosition + 1}</span>
                  </div>
                  <span className="text-gray-500">Below</span>
                </div>
              </div>
            </div>
            
            {/* Share Section */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">Share your progress</h4>
                <button 
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  onClick={() => navigator.share({
                    title: 'Check out my learning progress!',
                    text: `I've earned ${user.points} XP and I'm on a ${user.streak}-day streak! #Learning #GamifiedLearning`,
                    url: window.location.href,
                  }).catch(console.error)}
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </button>
              </div>
              
              <div className="flex justify-center space-x-4">
                <a 
                  href={`https://twitter.com/intent/tweet?text=I've earned ${user.points} XP and I'm on a ${user.streak}-day streak!&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=I've earned ${user.points} XP and I'm on a ${user.streak}-day streak!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href={`sms:?&body=Check out my learning progress! I've earned ${user.points} XP and I'm on a ${user.streak}-day streak! ${window.location.href}`}
                  className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                  aria-label="Share via SMS"
                >
                  <MessageSquare className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
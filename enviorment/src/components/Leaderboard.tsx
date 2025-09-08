import { Trophy, Award, Star, ChevronUp, ChevronDown, Minus, ArrowLeft } from 'lucide-react';

interface LeaderboardProps {
  onNavigate: (page: string) => void;
}

type User = {
  id: number;
  name: string;
  points: number;
  avatar: string;
  position: number;
  change: number; // 1 for up, -1 for down, 0 for no change
};

const Leaderboard: React.FC<LeaderboardProps> = ({ onNavigate }) => {
  // Sample leaderboard data with 10 users
  const leaderboardData: User[] = [
    { id: 1, name: 'Alex Johnson', points: 2450, avatar: 'AJ', position: 1, change: 1 },
    { id: 2, name: 'Sam Wilson', points: 2180, avatar: 'SW', position: 2, change: -1 },
    { id: 3, name: 'Jordan Lee', points: 2020, avatar: 'JL', position: 3, change: 1 },
    { id: 4, name: 'Taylor Smith', points: 1980, avatar: 'TS', position: 4, change: 0 },
    { id: 5, name: 'Casey Kim', points: 1920, avatar: 'CK', position: 5, change: 2 },
    { id: 6, name: 'Morgan Lee', points: 1780, avatar: 'ML', position: 6, change: 3 },
    { id: 7, name: 'Riley Chen', points: 1650, avatar: 'RC', position: 7, change: -2 },
    { id: 8, name: 'Jamie Park', points: 1520, avatar: 'JP', position: 8, change: 1 },
    { id: 9, name: 'Avery Wong', points: 1430, avatar: 'AW', position: 9, change: 0 },
    { id: 10, name: 'Quinn Taylor', points: 1350, avatar: 'QT', position: 10, change: -1 },
  ];

  // Get current user (sample data - replace with actual user data)
  const currentUser: User = {
    id: 6,
    name: 'You',
    points: 10, // Using the points we set earlier
    avatar: 'U',
    position: 15,
    change: 0,
  };

  // Add current user to the leaderboard if not in top 5
  const showCurrentUser = !leaderboardData.some(user => user.id === currentUser.id);

  const getMedal = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Award className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-sm font-medium text-gray-500">{position}</span>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ChevronUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <ChevronDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button 
        onClick={() => onNavigate('dashboard')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back to Dashboard
      </button>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Leaderboard</h1>
              <p className="text-blue-100">Top performers this week</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Trophy className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="divide-y divide-gray-100">
          {leaderboardData.map((user) => (
            <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="w-10 flex-shrink-0 flex items-center justify-center">
                  {getMedal(user.position)}
                </div>
                
                <div className="ml-4 flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">{user.avatar}</span>
                </div>
                
                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-xs text-gray-500">{user.points} points</span>
                  </div>
                </div>
                
                <div className="ml-4 flex items-center">
                  {user.change !== 0 && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {getChangeIcon(user.change)}
                      <span className="ml-1">{Math.abs(user.change)}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Current User */}
          {showCurrentUser && (
            <div className="bg-blue-50 p-4 border-t-2 border-blue-200">
              <div className="flex items-center">
                <div className="w-10 flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500">{currentUser.position}</span>
                </div>
                
                <div className="ml-4 flex-shrink-0 w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center border-2 border-blue-400">
                  <span className="text-blue-800 font-medium">{currentUser.avatar}</span>
                </div>
                
                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-sm font-bold text-blue-800 truncate">
                    {currentUser.name}
                  </p>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-xs text-blue-700">{currentUser.points} points</span>
                  </div>
                </div>
                
                <div className="ml-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    You
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="p-4 border-t border-gray-100 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Full Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

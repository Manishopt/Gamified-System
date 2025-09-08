import { Trophy, Star, Award, Target, Zap, Crown } from "lucide-react";
import type { UserType, CurrentPage } from "../App";

interface AchievementsPageProps {
  userType: UserType;
  user: any;
  onNavigate: (page: CurrentPage) => void;
}

export default function AchievementsPage({ userType, user, onNavigate }: AchievementsPageProps) {
  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first eco-lesson",
      icon: Star,
      earned: true,
      points: 10,
      category: "Learning"
    },
    {
      id: 2,
      title: "Water Warrior", 
      description: "Save 100 liters of water",
      icon: Trophy,
      earned: true,
      points: 25,
      category: "Conservation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {userType === "kids" ? " My Achievements" : " Recognition Center"}
          </h1>
          <button
            onClick={() => onNavigate("dashboard")}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl"
          >
            Back to Dashboard
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="bg-white p-6 rounded-2xl shadow-xl">
              <achievement.icon className="w-8 h-8 text-yellow-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
              <p className="text-gray-600">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

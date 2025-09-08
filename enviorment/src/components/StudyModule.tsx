import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Star, PlayCircle, BookOpen, Award } from 'lucide-react';
import type { UserType } from '../App';

interface StudyModuleProps {
  userType: UserType;
}

const kidsLessons = [
  {
    id: 1,
    title: 'Water Conservation',
    description: 'Learn how to save water at home',
    emoji: '💧',
    difficulty: 'Easy',
    points: 20,
    completed: true,
    duration: '5 min'
  },
  {
    id: 2,
    title: 'Recycling Basics',
    description: 'Sort trash and help the planet',
    emoji: '♻',
    difficulty: 'Easy',
    points: 15,
    completed: true,
    duration: '7 min'
  },
  {
    id: 3,
    title: 'Animal Habitats',
    description: 'Discover where animals live',
    emoji: '🏠',
    difficulty: 'Medium',
    points: 25,
    completed: false,
    duration: '10 min'
  },
  {
    id: 4,
    title: 'Clean Energy Fun',
    description: 'Solar and wind power games',
    emoji: '☀',
    difficulty: 'Medium',
    points: 30,
    completed: false,
    duration: '12 min'
  }
];

const adultLessons = [
  {
    id: 1,
    title: 'Climate Change Science',
    description: 'Understanding global warming mechanisms',
    emoji: '🌡',
    difficulty: 'Advanced',
    points: 50,
    completed: true,
    duration: '20 min'
  },
  {
    id: 2,
    title: 'Sustainable Agriculture',
    description: 'Modern farming for the future',
    emoji: '🌾',
    difficulty: 'Advanced',
    points: 45,
    completed: true,
    duration: '25 min'
  },
  {
    id: 3,
    title: 'Carbon Footprint Analysis',
    description: 'Measure and reduce your impact',
    emoji: '👣',
    difficulty: 'Expert',
    points: 60,
    completed: false,
    duration: '30 min'
  },
  {
    id: 4,
    title: 'Renewable Energy Systems',
    description: 'Design sustainable power solutions',
    emoji: '⚡',
    difficulty: 'Expert',
    points: 75,
    completed: false,
    duration: '35 min'
  }
];

interface Challenge {
  id: number;
  title: string;
  completed: boolean;
  points: number;
}

export default function StudyModule({ userType }: StudyModuleProps) {
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 1, title: 'Plant Growth Tracker', completed: false, points: 50 },
    { id: 2, title: 'Water Usage Calculator', completed: true, points: 50 },
    { id: 3, title: 'Recycling Guide', completed: true, points: 50 },
    { id: 4, title: 'Carbon Footprint Quiz', completed: true, points: 50 },
  ]);
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
  const lessons = userType === 'kids' ? kidsLessons : adultLessons;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-orange-100 text-orange-700';
      case 'Expert': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {userType === 'kids' ? 'Learning Center' : 'Study Projects'}
            </h1>
            <p className="text-gray-600 mt-2">
              {userType === 'kids' ? 'Fun lessons and interactive games' : 'Advanced environmental studies'}
            </p>
          </div>
          
          <div className="w-24"></div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">📚</div>
              <p className="text-sm text-gray-600">Total Lessons</p>
              <p className="text-2xl font-bold text-gray-800">{lessons.length}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{lessons.filter(l => l.completed).length}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-sm text-gray-600">Points Earned</p>
              <p className="text-2xl font-bold text-blue-600">
                {lessons.filter(l => l.completed).reduce((sum, l) => sum + l.points, 0)}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round((lessons.filter(l => l.completed).length / lessons.length) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`group bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer ${
                lesson.completed ? 'ring-2 ring-green-200' : ''
              }`}
              onClick={() => {
                if (lesson.title === 'Water Conservation') {
                  navigate('/study/water-conservation');
                } else {
                  setSelectedLesson(selectedLesson === lesson.id ? null : lesson.id);
                }
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl">{lesson.emoji}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
                    </div>
                  </div>
                  
                  {lesson.completed && (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                      {lesson.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">{lesson.duration}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold text-gray-700">{lesson.points} pts</span>
                  </div>
                </div>

                {/* Lesson Content Preview */}
                {selectedLesson === lesson.id && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <button className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors">
                        <PlayCircle className="w-5 h-5" />
                        <span>Start Lesson</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors">
                        <BookOpen className="w-5 h-5" />
                        <span>Read Material</span>
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>🎮 Interactive mini-games included</p>
                      <p>📝 Quiz at the end to test knowledge</p>
                      <p>🏆 Earn badges for completion</p>
                      {userType === 'adults' && <p>📊 Real-world case studies</p>}
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                {lesson.completed ? (
                  <div className="w-full bg-green-200 rounded-full h-2 mt-4">
                    <div className="bg-green-500 h-2 rounded-full w-full"></div>
                  </div>
                ) : (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div className="bg-gray-400 h-2 rounded-full w-0"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Challenges Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <Award className="mr-2 text-yellow-500" />
            Weekly Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <div 
                key={challenge.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  challenge.completed ? 'ring-2 ring-green-200' : ''
                }`}
                onClick={() => setSelectedChallenge(selectedChallenge === challenge.id ? null : challenge.id)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{challenge.title}</h3>
                    {challenge.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                  
                  {selectedChallenge === challenge.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Reward: {challenge.points} points</span>
                        <button 
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!challenge.completed) {
                              setChallenges(challenges.map(c => c.id === challenge.id ? { ...c, completed: true } : c));
                            }
                            navigate('/task1');
                          }}
                        >
                          {challenge.completed ? 'Completed' : 'Start Task'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Challenge */}
        <div className="mt-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">🔥 Daily Challenge</h3>
              <p className="text-white text-opacity-90 mb-4">
                {userType === 'kids' 
                  ? 'Complete a water-saving quiz and earn bonus points!' 
                  : 'Analyze a carbon footprint case study for bonus XP!'
                }
              </p>
              <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Challenge
              </button>
            </div>
            <div className="text-6xl">
              {userType === 'kids' ? '🎲' : '🧠'}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
import { useState } from 'react';
import { ArrowLeft, Camera, CheckCircle, Clock, Star, Upload, Target } from 'lucide-react';
import type { UserType, CurrentPage } from '../App';

interface TasksPageProps {
  userType: UserType;
  onNavigate: (page: CurrentPage) => void;
}

const kidsTasks = [
  {
    id: 1,
    title: 'Plant a Seed',
    description: 'Plant seeds in a small pot and share a photo',
    emoji: '🌱',
    points: 25,
    difficulty: 'Easy',
    timeEstimate: '15 min',
    completed: true,
    type: 'photo'
  },
  {
    id: 2,
    title: 'Save Water',
    description: 'Turn off the tap while brushing teeth for 3 days',
    emoji: '💧',
    points: 20,
    difficulty: 'Easy',
    timeEstimate: '3 days',
    completed: true,
    type: 'habit'
  },
  {
    id: 3,
    title: 'Clean Up Park',
    description: 'Pick up 10 pieces of litter in your local park',
    emoji: '🗑',
    points: 30,
    difficulty: 'Medium',
    timeEstimate: '30 min',
    completed: false,
    type: 'photo'
  },
  {
    id: 4,
    title: 'Make Bird Food',
    description: 'Create a bird feeder using recycled materials',
    emoji: '🐦',
    points: 35,
    difficulty: 'Medium',
    timeEstimate: '45 min',
    completed: false,
    type: 'photo'
  }
];

const adultTasks = [
  {
    id: 1,
    title: 'Carbon Footprint Audit',
    description: 'Calculate and document your monthly carbon footprint',
    emoji: '📊',
    points: 50,
    difficulty: 'Advanced',
    timeEstimate: '2 hours',
    completed: true,
    type: 'document'
  },
  {
    id: 2,
    title: 'Community Garden',
    description: 'Start or join a community garden project',
    emoji: '🌻',
    points: 75,
    difficulty: 'Expert',
    timeEstimate: '1 week',
    completed: false,
    type: 'project'
  },
  {
    id: 3,
    title: 'Renewable Energy Research',
    description: 'Research and present renewable energy solutions for your area',
    emoji: '⚡',
    points: 100,
    difficulty: 'Expert',
    timeEstimate: '3 days',
    completed: false,
    type: 'research'
  },
  {
    id: 4,
    title: 'Plastic-Free Week',
    description: 'Document your journey going plastic-free for 7 days',
    emoji: '🚫',
    points: 60,
    difficulty: 'Advanced',
    timeEstimate: '1 week',
    completed: false,
    type: 'challenge'
  }
];

export default function TasksPage({ userType, onNavigate }: TasksPageProps) {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  const tasks = userType === 'kids' ? kidsTasks : adultTasks;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Expert': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return Camera;
      case 'document': return Upload;
      case 'project': return Target;
      case 'research': return Upload;
      case 'challenge': return Clock;
      default: return Target;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {userType === 'kids' ? 'Eco Tasks' : 'Environmental Challenges'}
            </h1>
            <p className="text-gray-600 mt-2">
              {userType === 'kids' ? 'Complete fun eco-missions and earn points!' : 'Take on real-world environmental challenges'}
            </p>
          </div>
          
          <div className="w-24"></div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-800">{tasks.length}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-700">{tasks.filter(t => t.completed).length}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-gray-600">Points Earned</p>
              <p className="text-2xl font-bold text-orange-600">
                {tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0)}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-gray-600">Streak</p>
              <p className="text-2xl font-bold text-purple-600">7 days</p>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tasks.map((task) => {
            const TypeIcon = getTypeIcon(task.type);
            return (
              <div
                key={task.id}
                className={`group bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                  task.completed ? 'ring-2 ring-green-200 bg-green-50' : ''
                }`}
              >
                <div className="p-6">
                  {/* Task Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-5xl">{task.emoji}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                          {task.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                      </div>
                    </div>
                    
                    {task.completed && (
                      <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Task Meta */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(task.difficulty)}`}>
                        {task.difficulty}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{task.timeEstimate}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold text-gray-700">{task.points} pts</span>
                    </div>
                  </div>

                  {/* Action Section */}
                  {!task.completed && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <TypeIcon className="w-5 h-5" />
                        <span className="text-sm">
                          {task.type === 'photo' ? 'Upload photo proof' :
                           task.type === 'document' ? 'Submit documentation' :
                           task.type === 'project' ? 'Share project details' :
                           task.type === 'research' ? 'Submit research' :
                           'Track your progress'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                        >
                          Start Task
                        </button>
                        
                        {task.type === 'photo' && (
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors">
                            <Camera className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      {/* Task Details */}
                      {selectedTask === task.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl animate-fade-in">
                          <h4 className="font-semibold text-gray-800 mb-3">Task Instructions:</h4>
                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            {task.type === 'photo' ? (
                              <>
                                <p>📸 Take clear photos showing your completed task</p>
                                <p>📅 Include the date in your photo if possible</p>
                                <p>✅ Submit for review to earn points</p>
                              </>
                            ) : task.type === 'document' ? (
                              <>
                                <p>📋 Prepare detailed documentation</p>
                                <p>📊 Include data and analysis</p>
                                <p>📤 Upload your completed work</p>
                              </>
                            ) : (
                              <>
                                <p>🎯 Follow the task guidelines carefully</p>
                                <p>📝 Document your progress</p>
                                <p>🏆 Submit completion proof</p>
                              </>
                            )}
                          </div>
                          
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">Upload your submission</p>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                              Choose File
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Completion Status */}
                  {task.completed && (
                    <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Task Completed!</span>
                      </div>
                      <p className="text-green-600 text-sm mt-1">Great work! You've earned {task.points} points.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Challenge */}
        <div className="mt-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">🔥 Weekly Challenge</h3>
              <p className="text-white text-opacity-90 mb-4">
                {userType === 'kids' 
                  ? 'Complete 3 eco-tasks this week for a bonus badge!' 
                  : 'Lead a community environmental initiative this week!'
                }
              </p>
              <div className="flex items-center space-x-4">
                <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Join Challenge
                </button>
                <div className="text-white text-opacity-90">
                  <span className="text-sm">Progress: 2/3 tasks</span>
                </div>
              </div>
            </div>
            <div className="text-8xl opacity-80">
              {userType === 'kids' ? '🏃‍♂' : '🌟'}
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
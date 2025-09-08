import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, Zap, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { UserType } from '../App';

// Sound effects
const playSuccessSound = () => {
  const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
  audio.volume = 0.5;
  audio.play().catch(e => console.log('Audio play failed:', e));
};

const playLevelUpSound = () => {
  const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3');
  audio.volume = 0.5;
  audio.play().catch(e => console.log('Audio play failed:', e));
};

interface LearningProps {
  userType?: UserType;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  points: number;
}


// Types
type Level = {
  id: number;
  title: string;
  description: string;
  content: React.ReactNode;
  completed: boolean;
  locked: boolean;
  emoji?: string;
  difficulty?: string;
  points?: number;
};

const Learning: React.FC<LearningProps> = ({ userType = 'kids' }) => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [showLevelComplete, setShowLevelComplete] = useState<boolean>(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_steps',
      title: 'First Steps',
      description: 'Complete your first level',
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      unlocked: false,
      points: 50
    },
    {
      id: 'water_master',
      title: 'Water Master',
      description: 'Complete all water conservation levels',
      icon: <Zap className="w-5 h-5 text-blue-500" />,
      unlocked: false,
      points: 200
    },
    {
      id: 'fast_learner',
      title: 'Fast Learner',
      description: 'Complete a level in under 2 minutes',
      icon: <Zap className="w-5 h-5 text-purple-500" />,
      unlocked: false,
      points: 100
    }
  ]);

  const [levels, setLevels] = useState<Level[]>([
    {
      id: 1,
      title: "Water Basics",
      description: "Understand the fundamentals of water conservation",
      emoji: "💧",
      difficulty: "Beginner",
      points: 100,
      completed: false,
      locked: false,
      content: (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">💧 Water Basics</h3>
          <p className="mb-4">Water is essential for all life on Earth, but only 3% of the world's water is fresh water, and less than 1% is available for human use.</p>
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-gray-800">What you'll learn:</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>The importance of water conservation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>How water is used in daily life</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Simple ways to save water at home</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Learn why water conservation is important</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Understand the water cycle</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "🚿 Home Conservation",
      description: "Learn how to save water at home",
      emoji: "🏠",
      difficulty: "Easy",
      points: 150,
      completed: false,
      locked: true,
      content: (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">🚿 Home Conservation</h3>
          <p className="mb-4">The average household can save thousands of gallons of water each year with simple changes.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Fix leaky faucets and pipes</li>
            <li>Install water-efficient fixtures</li>
            <li>Take shorter showers</li>
            <li>Turn off the tap while brushing teeth</li>
          </ul>
        </div>
      )
    },
    {
      id: 3,
      title: "Outdoor Water Use",
      description: "Smart water use in your garden",
      emoji: "🌱",
      difficulty: "Intermediate",
      points: 200,
      completed: false,
      locked: true,
      content: (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">🌱 Outdoor Water Use</h3>
          <p className="mb-4">Outdoor water use accounts for a significant portion of residential water consumption.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold">🌼 Smart Landscaping</h4>
              <p className="text-sm">Use native plants that require less water</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold">⏰ Watering Times</h4>
              <p className="text-sm">Water early morning or late evening to reduce evaporation</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Community Impact",
      description: "How communities can conserve water",
      emoji: "🏭",
      difficulty: "Advanced",
      points: 250,
      completed: false,
      locked: true,
      content: (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">🏭 Community Impact</h3>
          <p className="mb-4">Community efforts can significantly impact water conservation on a larger scale.</p>
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-semibold">🌍 Community Programs</h4>
              <p className="text-sm">Participate in local water conservation programs</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold">🏙️ Urban Planning</h4>
              <p className="text-sm">Support green infrastructure in your community</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Global Water Issues",
      description: "Understanding global water challenges",
      emoji: "🌊",
      difficulty: "Expert",
      points: 300,
      completed: false,
      locked: true,
      content: (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">🌊 Global Water Issues</h3>
          <p className="mb-4">Water scarcity affects every continent and affects more than 40% of the global population.</p>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold">Did you know?</h4>
            <p>By 2025, two-thirds of the world's population may face water shortages.</p>
          </div>
        </div>
      )
    },
  ]);

  // Effect to load and save progress
  useEffect(() => {
    const savedProgress = localStorage.getItem('waterConservationProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setLevels(prevLevels => 
        prevLevels.map(level => ({
          ...level,
          completed: progress[level.id]?.completed || false,
          locked: progress[level.id]?.locked || level.locked
        }))
      );
    }
  }, []);

  // Check and unlock achievements
  const checkAchievements = (completedLevels: number, timeSpent: number) => {
    const newAchievements = [...achievements];
    let achievementUnlocked = false;
    
    // First Steps
    if (completedLevels >= 1 && !achievements[0].unlocked) {
      newAchievements[0].unlocked = true;
      setShowAchievement(newAchievements[0]);
      setTotalPoints(prev => prev + newAchievements[0].points);
      playSuccessSound();
      achievementUnlocked = true;
    }
    
    // Water Master (assuming 5 levels total)
    if (completedLevels >= 5 && !achievements[1].unlocked) {
      newAchievements[1].unlocked = true;
      setShowAchievement(prev => prev || newAchievements[1]);
      setTotalPoints(prev => prev + newAchievements[1].points);
      playLevelUpSound();
      achievementUnlocked = true;
    }
    
    // Fast Learner
    if (timeSpent < 120 && !achievements[2].unlocked) {
      newAchievements[2].unlocked = true;
      setShowAchievement(prev => prev || newAchievements[2]);
      setTotalPoints(prev => prev + newAchievements[2].points);
      playSuccessSound();
      achievementUnlocked = true;
    }
    
    if (achievementUnlocked) {
      setAchievements(newAchievements);
      setTimeout(() => setShowAchievement(null), 3000);
    }
  };

  // Save progress when levels change
  useEffect(() => {
    const completedLevels = levels.filter(level => level.completed).length;
    
    const progress = levels.reduce((acc, level) => ({
      ...acc,
      [level.id]: {
        completed: level.completed,
        locked: level.locked,
        score: level.completed ? 100 : 0,
        stars: level.completed ? 3 : 0,
        timeSpent: timeSpent,
        lastPlayed: Date.now()
      }
    }), {});
    
    localStorage.setItem('waterConservationProgress', JSON.stringify(progress));
    
    // Check for achievements
    checkAchievements(completedLevels, timeSpent);
    
    // Show level complete animation if needed
    if (levels[currentLevel - 1]?.completed) {
      setShowLevelComplete(true);
      const timer = setTimeout(() => setShowLevelComplete(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [levels]);

  // Calculate stars based on performance
  const calculateStars = (level: Level) => {
    if (!level.completed) return 0;
    // In a real app, this would be based on performance metrics
    return Math.min(3, Math.floor(Math.random() * 4));
  };

  // Complete current level
  const completeCurrentLevel = () => {
    const newLevels = [...levels];
    const current = newLevels[currentLevel - 1];
    
    if (!current.completed) {
      current.completed = true;
      const stars = calculateStars(current);
      const pointsEarned = 100 + (stars * 50);
      
      // Unlock next level if exists
      if (currentLevel < newLevels.length) {
        newLevels[currentLevel].locked = false;
      }
      
      setLevels(newLevels);
      setTotalPoints(prev => prev + pointsEarned);
      playSuccessSound();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Achievement Toast */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-xl z-50 max-w-sm border-l-4 border-yellow-400"
          >
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-yellow-100 mr-3">
                {showAchievement.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Achievement Unlocked!</h3>
                <p className="text-gray-600">{showAchievement.title}</p>
                <p className="text-sm text-gray-500">+{showAchievement.points} points</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Complete Animation */}
      <AnimatePresence>
        {showLevelComplete && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white p-8 rounded-2xl text-center max-w-md w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Level Complete!</h2>
              <p className="text-gray-600 mb-6">Great job! You've completed this level.</p>
              <div className="flex justify-center space-x-1 mb-6">
                {[1, 2, 3].map(star => (
                  <Star 
                    key={star} 
                    className={`w-8 h-8 ${star <= calculateStars(levels[currentLevel - 1]) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <button
                onClick={() => setShowLevelComplete(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        {/* Header with Stats */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/study')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50"
                type="button"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Lessons</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-xs text-gray-500">Level</div>
                <div className="text-xl font-bold text-gray-800">{currentLevel}/{levels.length}</div>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Points</div>
                <div className="text-xl font-bold text-yellow-600 flex items-center">
                  <Trophy className="w-5 h-5 mr-1" /> {totalPoints}
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Mode</div>
                <div className="text-sm font-medium text-gray-700 px-2 py-1 bg-blue-100 rounded-full">
                  {userType === 'kids' ? '👶 Kids' : '🧑 Adults'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2.5 rounded-full" 
                style={{ width: `${(currentLevel / levels.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Progress</span>
              <span>{Math.round((currentLevel / levels.length) * 100)}% Complete</span>
            </div>
          </div>
        </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">💧 Water Conservation</h1>
            <p className="text-gray-600 mb-8">Complete each level to become a water conservation expert!</p>
          </div>
        
        {/* Progress Bar */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Progress</span>
            <span className="text-sm font-medium text-blue-700">
              {levels.filter(level => level.completed).length} of {levels.length} levels completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ 
                width: `${(levels.filter(level => level.completed).length / levels.length) * 100}%`,
                transition: 'width 0.5s ease-in-out'
              }}
            ></div>
          </div>
        </div>

        {/* Level Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          {levels.map((level) => {
            const isCurrent = currentLevel === level.id;
            const isLocked = level.locked && !level.completed;
            
            return (
              <motion.button
                key={level.id}
                onClick={() => !isLocked && setCurrentLevel(level.id)}
                whileHover={!isLocked ? { y: -5 } : {}}
                whileTap={!isLocked ? { scale: 0.95 } : {}}
                className={`relative p-4 rounded-xl text-center transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg transform scale-105 z-10'
                    : isLocked
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white hover:bg-blue-50 text-blue-600 hover:shadow-md border-2 border-blue-100'
                }`}
                disabled={isLocked}
              >
                {level.completed && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                    <Star className="w-4 h-4 text-white" fill="white" />
                  </div>
                )}
                
                <div className="text-3xl mb-2">{level.emoji || '📚'}</div>
                <div className="font-medium text-sm">{level.title}</div>
                
                {level.completed ? (
                  <div className="flex justify-center mt-2">
                    {[1, 2, 3].map(star => (
                      <Star 
                        key={star} 
                        className={`w-3 h-3 ${star <= calculateStars(level) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                ) : isLocked ? (
                  <div className="text-xs mt-1 flex items-center justify-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Locked
                  </div>
                ) : (
                  <div className="text-xs mt-1 text-green-600">Available</div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Level Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLevel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {levels[currentLevel - 1].title}
                    </h2>
                    <p className="text-gray-600">{levels[currentLevel - 1].description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {levels[currentLevel - 1].difficulty} Level
                    </span>
                    {levels[currentLevel - 1].completed && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  {levels[currentLevel - 1].content}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Earn up to {150 + (currentLevel * 25)} points</span>
                  </div>
                  
                  {!levels[currentLevel - 1].completed ? (
                    <motion.button
                      onClick={completeCurrentLevel}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Complete Level
                    </motion.button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[1, 2, 3].map(star => (
                          <Star 
                            key={star} 
                            className={`w-5 h-5 ${star <= calculateStars(levels[currentLevel - 1]) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        Completed!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentLevel(prev => Math.max(1, prev - 1))}
                disabled={currentLevel === 1}
                className={`flex items-center px-4 py-2 rounded-lg ${currentLevel === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous Level
              </button>
              
              <button
                onClick={() => setCurrentLevel(prev => Math.min(levels.length, prev + 1))}
                disabled={currentLevel === levels.length || levels[currentLevel]?.locked}
                className={`flex items-center px-4 py-2 rounded-lg ${(currentLevel === levels.length || levels[currentLevel]?.locked) ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                Next Level
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Achievement Progress */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Your Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map(achievement => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-xl border-2 ${
                  achievement.unlocked 
                    ? 'bg-white border-yellow-300 shadow-md' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-lg mr-3 ${
                    achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-200'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {achievement.points} pts
                      </span>
                      {achievement.unlocked ? (
                        <span className="text-xs text-green-600 font-medium">
                          ✓ Unlocked
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level Completion Message */}
        {levels[currentLevel - 1].completed && (
          <div className="text-center p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
            <p className="font-medium">🎉 Level Completed!</p>
            {currentLevel < levels.length ? (
              <p>You've unlocked the next level!</p>
            ) : (
              <p>Congratulations! You've completed all levels! 🎊</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Learning;
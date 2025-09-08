import { useState } from 'react';
import { BookOpen, Target, Trophy, FolderOpen, Zap, Award, TreePine, Fish, Bird, Router as Butterfly } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UserType } from '../App';

interface LandingPageProps {
  onUserTypeSelect: (type: UserType) => void;
}

interface InteractiveObject {
  icon: LucideIcon;
  position: string;
  sound: string;
  color: string;
}

const interactiveObjects: InteractiveObject[] = [
  { icon: TreePine, position: 'top-16 left-16', sound: '🌳 Trees produce oxygen!', color: 'text-green-600' },
  { icon: Fish, position: 'bottom-32 left-32', sound: '🐟 Protect our oceans!', color: 'text-blue-500' },
  { icon: Bird, position: 'top-32 right-24', sound: '🐦 Save bird habitats!', color: 'text-yellow-600' },
  { icon: Butterfly, position: 'bottom-16 right-16', sound: '🦋 Pollinators need our help!', color: 'text-purple-500' }
];

export default function LandingPage({ onUserTypeSelect }: LandingPageProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [soundMessage, setSoundMessage] = useState<string>('');

  const handleObjectClick = (message: string) => {
    setSoundMessage(message);
    const timer = setTimeout(() => setSoundMessage(''), 2000);
    return () => clearTimeout(timer);
  };

  interface OptionType {
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
  }

  const kidsOptions: OptionType[] = [
    { icon: BookOpen, title: 'Study', description: 'Interactive lessons & games', color: 'from-green-400 to-blue-400' },
    { icon: Target, title: 'Tasks', description: 'Fun eco-challenges', color: 'from-blue-400 to-purple-400' },
    { icon: Trophy, title: 'Achievements', description: 'Badges & rewards', color: 'from-purple-400 to-pink-400' }
  ];

  const adultsOptions: OptionType[] = [
    { icon: FolderOpen, title: 'Projects', description: 'Real-world initiatives', color: 'from-green-500 to-teal-500' },
    { icon: Zap, title: 'Challenges', description: 'Advanced eco-missions', color: 'from-teal-500 to-blue-500' },
    { icon: Award, title: 'Achievements', description: 'Professional recognition', color: 'from-blue-500 to-indigo-500' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Interactive Background Objects */}
      {interactiveObjects.map((obj, index) => (
        <button
          key={index}
          onClick={() => handleObjectClick(obj.sound)}
          className={`absolute ${obj.position} ${obj.color} hover:scale-125 transition-all duration-300 animate-pulse hover:animate-bounce z-10`}
        >
          <obj.icon className="w-12 h-12 drop-shadow-lg" />
        </button>
      ))}

      {/* Sound Message Display */}
      {soundMessage && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in">
          <p className="text-sm font-medium text-gray-800">{soundMessage}</p>
        </div>
      )}

      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Choose Your Path
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select your learning journey and discover how you can make a positive impact on our planet
          </p>
        </div>

        {/* Main Cards */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8 w-full max-w-5xl">
          {/* Kids Card */}
          <div className="flex-1 group">
            <div className="relative h-96 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl cursor-pointer overflow-hidden"
                 onClick={() => setSelectedCard(selectedCard === 'kids' ? null : 'kids')}>
              <div className="absolute inset-0  bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
              
              {/* Card Content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                <div>
                  <div className="text-6xl mb-4 animate-bounce">🧒</div>
                  <h2 className="text-4xl font-bold mb-3">Kids</h2>
                  <p className="text-lg opacity-90">Ages 6-12</p>
                  <p className="text-base opacity-75 mt-2">Fun games, colorful lessons, and easy eco-tasks</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className=" bg-opacity-20 px-4 py-2 rounded-full text-sm">
                    Interactive Learning
                  </span>
                  <div className="text-2xl group-hover:animate-bounce">🌟</div>
                </div>
              </div>

              {/* Parallax Effect */}
              <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                <div className="absolute top-8 right-8 text-6xl animate-pulse">🌱</div>
                <div className="absolute bottom-8 left-8 text-4xl animate-pulse" style={{ animationDelay: '1s' }}>🦋</div>
              </div>
            </div>

            {/* Kids Options */}
            {selectedCard === 'kids' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in text-center">
                {kidsOptions.map((option, index) => (
                  <button
                    key={option.title}
                    onClick={() => onUserTypeSelect('kids')}
                    className={`p-6 rounded-xl bg-gradient-to-r ${option.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <option.icon className="w-8 h-8 mb-3 mx-auto" />
                    <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                    <p className="text-sm opacity-90">{option.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Adults Card */}
          <div className="flex-1 group">
            <div className="relative h-96 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl cursor-pointer overflow-hidden"
                 onClick={() => setSelectedCard(selectedCard === 'adults' ? null : 'adults')}>
              <div className="absolute inset-0  bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
              
              {/* Card Content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                <div>
                  <div className="text-6xl mb-4 animate-pulse">🎓</div>
                  <h2 className="text-4xl font-bold mb-3">Adults</h2>
                  <p className="text-lg opacity-90">College & Beyond</p>
                  <p className="text-base opacity-75 mt-2">Advanced projects, research, and leadership challenges</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className=" bg-opacity-20 px-4 py-2 rounded-full text-sm">
                    Professional Impact
                  </span>
                  <div className="text-2xl group-hover:animate-spin">🌍</div>
                </div>
              </div>

              {/* Parallax Effect */}
              <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                <div className="absolute top-8 right-8 text-6xl animate-pulse">🔬</div>
                <div className="absolute bottom-8 left-8 text-4xl animate-pulse" style={{ animationDelay: '1s' }}>🏆</div>
              </div>
            </div>

            {/* Adults Options */}
            {selectedCard === 'adults' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in text-center">
                {adultsOptions.map((option, index) => (
                  <button
                    key={option.title}
                    onClick={() => onUserTypeSelect('adults')}
                    className={`p-6 rounded-xl bg-gradient-to-r ${option.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <option.icon className="w-8 h-8 mb-3 mx-auto" />
                    <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                    <p className="text-sm opacity-90">{option.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">🌟 Click on environmental objects around the screen for eco-tips!</p>
          <p className="text-sm text-gray-500">Join thousands of eco-learners making a difference worldwide</p>
        </div>
      </div>

      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in { animation: fade-in 0.6s ease-out; }
          .shadow-3xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        `}
      </style>
    </div>
  );
}
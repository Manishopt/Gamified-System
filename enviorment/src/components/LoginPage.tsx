import React, { useState, useEffect } from 'react';
import { Leaf, TreePine, Waves, Sun, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: (userData: any) => void;
}

const ecoQuotes = [
  "🌱 Every small action makes a big difference!",
  "🌍 Be the change you wish to see in the world",
  "🌳 Plant seeds of kindness wherever you go",
  "💧 Save water, save life, save the future",
  "♻ Reduce, reuse, recycle for a better tomorrow"
];

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [avatarMood, setAvatarMood] = useState('happy');

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % ecoQuotes.length);
    }, 3000);
    return () => clearInterval(quoteInterval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: '', password: '' });
    
    // Basic validation
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      setAvatarMood('sad');
      return;
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      setAvatarMood('sad');
      return;
    }

    setIsLoading(true);
    setAvatarMood('excited');
    
    // Simulate login process
    setTimeout(() => {
      onLogin({
        email,
        name: email.split('@')[0],
        points: 150,
        level: 'Eco-Warrior',
        streak: 7,
        badges: 5
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Animated Environmental Background - Left side */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-green-400 via-blue-500 to-green-600 relative overflow-hidden min-h-[40vh] lg:min-h-screen order-2 lg:order-1">
        <div className="absolute inset-0 bg- bg-opacity-20"></div>
        
        {/* Animated Sun */}
        <div className="absolute top-8 right-8 animate-pulse">
          <Sun className="w-16 h-16 text-yellow-300 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        
        {/* Floating Clouds */}
        <div className="absolute top-16 left-8 animate-bounce" style={{ animationDelay: '0s', animationDuration: '6s' }}>
          <div className="w-20 h-12 bg-white bg-opacity-30 rounded-full"></div>
        </div>
        <div className="absolute top-32 right-16 animate-bounce" style={{ animationDelay: '2s', animationDuration: '8s' }}>
          <div className="w-16 h-8 bg-white bg-opacity-25 rounded-full"></div>
        </div>
        
        {/* Flowing River */}
        <div className="absolute bottom-0 left-0 right-0">
          <Waves className="w-full h-16 text-blue-300 animate-pulse" />
        </div>
        
        {/* Trees */}
        <div className="absolute bottom-16 left-8 animate-sway">
          <TreePine className="w-12 h-20 text-green-800" />
        </div>
        <div className="absolute bottom-16 right-8 animate-sway" style={{ animationDelay: '1s' }}>
          <TreePine className="w-10 h-16 text-green-700" />
        </div>
        
        {/* Falling Leaves */}
        <div className="absolute top-1/4 left-1/4 animate-pulse">
          <Leaf className="w-6 h-6 text-green-300 transform rotate-45 animate-spin" style={{ animationDuration: '10s' }} />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-pulse" style={{ animationDelay: '3s' }}>
          <Leaf className="w-4 h-4 text-yellow-300 transform -rotate-12 animate-spin" style={{ animationDuration: '15s' }} />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">EcoLearn</h1>
            <p className="text-xl animate-fade-in" style={{ animationDelay: '0.5s' }}>
              Discover, Learn, Act for our Planet
            </p>
          </div>
        </div>
      </div>

      {/* Login Form - Right side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white order-1 lg:order-2">
        <div className="max-w-md w-full">
          {/* Eco Avatar */}
          <div className="text-center mb-8">
            <div className={`inline-block text-8xl transition-all duration-500 ${
              avatarMood === 'happy' ? 'animate-bounce' : 
              avatarMood === 'excited' ? 'animate-pulse' : 
              'animate-pulse'
            }`}>
              {avatarMood === 'happy' ? '🌳' : avatarMood === 'excited' ? '🌟' : '🌱'}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mt-4">Welcome Back!</h2>
            <p className="text-gray-600 mt-2">Login to continue your eco-journey</p>
          </div>

          {/* Motivational Quote */}
          <div className="text-center mb-6 h-8">
            <p className="text-sm text-green-600 animate-fade-in transition-all duration-500">
              {ecoQuotes[currentQuote]}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                  errors.email 
                    ? 'border-red-300 bg-red-50 animate-shake' 
                    : 'border-gray-200 focus:border-green-400 focus:bg-green-50 focus:shadow-lg'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none pr-12 ${
                    errors.password 
                      ? 'border-red-300 bg-red-50 animate-shake' 
                      : 'border-gray-200 focus:border-green-400 focus:bg-green-50 focus:shadow-lg'
                  }`}
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-500 transform ${
                isLoading
                  ? 'bg-green-400 scale-105 animate-pulse'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:scale-105 hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Growing your eco-profile...
                </div>
              ) : (
                'Start Your Eco Journey 🌱'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              New to EcoLearn?{' '}
              <button className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }
        
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-shake { animation: shake 0.6s ease-out; }
        .animate-sway { animation: sway 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
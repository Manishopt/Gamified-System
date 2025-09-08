import * as React from 'react';
import { useState, useEffect } from 'react';
import { Leaf, TreePine, Waves, Sun } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { getAuth, GoogleAuthProvider, signInWithPopup, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import app from '../firebase/firebase';

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
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '' });
  const [avatarMood, setAvatarMood] = useState('happy');

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % ecoQuotes.length);
    }, 3000);
    return () => clearInterval(quoteInterval);
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setAvatarMood('excited');
      
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL,
        points: 0
      };
      onLogin(userData);
      // Navigation is now handled by the parent component
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setErrors({ email: 'Failed to sign in with Google. Please try again.' });
      setAvatarMood('sad');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: '' });
    
    if (!email) {
      setErrors({ email: 'Email is required' });
      setAvatarMood('sad');
      return;
    }
    
    try {
      setIsLoading(true);
      const auth = getAuth(app);
      const actionCodeSettings = {
        // URL you want to redirect back to after email sign-in is completed
        url: window.location.origin + '/complete-signin',
        handleCodeInApp: true,
      };
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Save the email locally to complete sign-in after email click
      window.localStorage.setItem('emailForSignIn', email);
      
      alert(`Sign-in link sent to ${email}. Please check your email to continue.`);
      setEmail('');
      
    } catch (error) {
      console.error('Error sending sign-in link:', error);
      setErrors({ email: 'Failed to send sign-in link. Please try again.' });
      setAvatarMood('sad');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if we're returning from an email sign-in link
  useEffect(() => {
    const checkEmailSignIn = async () => {
      const auth = getAuth(app);
      
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        
        if (!email) {
          // User opened the link on a different device
          email = window.prompt('Please provide your email for confirmation');
        }
        
        if (email) {
          try {
            setIsLoading(true);
            const result = await signInWithEmailLink(auth, email, window.location.href);
            
            // Clear the email from storage
            window.localStorage.removeItem('emailForSignIn');
            
            // User signed in successfully
            const user = result.user;
            onLogin({
              email: user.email,
              name: user.displayName || email.split('@')[0],
              photoURL: user.photoURL,
              points: 0, // Initialize with default values
              level: 'Beginner',
              streak: 0,
              badges: 0
            });
            
            // Remove the sign-in link from the URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
          } catch (error) {
            console.error('Error signing in with email link:', error);
            setErrors({ email: 'Invalid or expired sign-in link. Please try again.' });
            setAvatarMood('sad');
          } finally {
            setIsLoading(false);
          }
        }
      }
    };
    
    checkEmailSignIn();
  }, [onLogin]);

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
            <h2 className="text-3xl font-bold text-gray-800 mt-4">Welcome to EcoLearn!</h2>
            <p className="text-gray-600 mt-2">Sign in to continue your eco-journey</p>
          </div>

          {/* Motivational Quote */}
          <div className="text-center mb-6 h-8">
            <p className="text-sm text-green-600 animate-fade-in transition-all duration-500">
              {ecoQuotes[currentQuote]}
            </p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleEmailSubmit} className="space-y-4">
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

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                Get Magic Link
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign in with</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  <FcGoogle className="w-5 h-5" />
                  Continue with Google
                </>
              )}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              By continuing, you agree to our{' '}
              <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>.
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
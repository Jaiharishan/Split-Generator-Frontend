import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Github, Receipt, Users, Calculator, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GoogleOAuth from '../components/GoogleOAuth';

function LoginPage() {
  const navigate = useNavigate();
  const { login, register, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.name
        });
      }
      navigate('/bills');
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    navigate('/bills');
  };

  const handleGoogleError = (errorMessage) => {
    console.error('Google OAuth error:', errorMessage);
  };

  const handleGithubLogin = () => {
    alert('GitHub OAuth integration requires setting up GitHub OAuth App. This is a placeholder.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 p-12 text-white">
        <div className="max-w-md mx-auto flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <Receipt className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Split Generator</h1>
            </div>
            <p className="text-primary-100 text-lg leading-relaxed">
              The smart way to split grocery bills with friends and family. Upload receipts, add participants, and let us handle the math.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Upload Receipts</h3>
                <p className="text-primary-100">Simply upload your grocery receipts or e-bills</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Add Participants</h3>
                <p className="text-primary-100">Invite friends and family to split the bill</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Automatic Calculation</h3>
                <p className="text-primary-100">Get instant totals and splits for everyone</p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center mb-3">
              <Sparkles className="h-5 w-5 text-yellow-300 mr-2" />
              <span className="font-semibold">Why choose Split Generator?</span>
            </div>
            <ul className="text-primary-100 space-y-2 text-sm">
              <li>• OCR technology for automatic receipt parsing</li>
              <li>• Support for images and PDF receipts</li>
              <li>• Real-time bill splitting calculations</li>
              <li>• Secure and private data handling</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary-600 p-3 rounded-xl mr-3">
                <Receipt className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Split Generator</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Split grocery bills with ease
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {isLogin ? 'Welcome back!' : 'Create your account'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isLogin ? 'Sign in to continue managing your bills' : 'Join thousands of users splitting bills easily'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                    <User className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="Enter your email"
                  />
                  <Mail className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <Lock className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="my-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-4">
              <GoogleOAuth 
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                className="w-full"
              />
              
              <button
                type="button"
                onClick={handleGithubLogin}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <Github className="h-5 w-5 mr-3" />
                Continue with GitHub
              </button>
            </div>

            {/* Terms */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By continuing, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 
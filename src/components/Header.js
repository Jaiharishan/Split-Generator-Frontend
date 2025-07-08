import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Receipt, Moon, Sun, User, LogOut, Settings, ChevronDown, Crown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Show simplified header on landing page for unauthenticated users
  if (!user && location.pathname === '/') {
    return (
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Receipt className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Split Generator
              </span>
            </Link>

            {/* Right side - Theme toggle and Sign In */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Sign In button */}
              <Link
                to="/login"
                className="btn-primary"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Receipt className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Split Generator
              </span>
            </Link>
            
            {user && (
              <nav className="hidden md:flex space-x-6">
                <Link
                  to="/bills"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Bills
                </Link>
                <Link
                  to="/create"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Create Bill
                </Link>
                <Link
                  to="/templates"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Templates
                </Link>
                <Link
                  to="/premium"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Premium
                </Link>
              </nav>
            )}
          </div>

          {/* Right side - Theme toggle and User menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* User Profile Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/settings');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/premium');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      {isPremium ? 'Premium Settings' : 'Upgrade to Premium'}
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Login button for unauthenticated users (not on landing page) */}
            {!user && location.pathname !== '/' && (
              <Link
                to="/login"
                className="btn-primary"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => {
            // Add mobile menu functionality
          }}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header; 
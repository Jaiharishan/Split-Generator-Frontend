import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, Mail, Sun, Moon, Lock, Save } from 'lucide-react';

function SettingsPage() {
  const { user, changePassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      setLoading(true);
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-8">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

          {/* Profile Info */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="h-14 w-14 rounded-full" />
              ) : (
                <div className="h-14 w-14 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <User className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
            <button
              onClick={toggleTheme}
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
              {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </div>

          {/* Change Password */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="btn-secondary"
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </button>
            ) : (
              <form onSubmit={handleSubmitPassword} className="space-y-4 mt-2">
                <div>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="input w-full"
                    placeholder="Current password"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input w-full"
                    placeholder="New password"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input w-full"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}
                {message && <div className="text-green-600 dark:text-green-400 text-sm">{message}</div>}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setError(null);
                      setMessage(null);
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage; 
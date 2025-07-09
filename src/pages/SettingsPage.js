import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePremium } from '../contexts/PremiumContext';
import { 
  User, Mail, Sun, Moon, Lock, Save, Crown, 
  LogOut, CheckCircle, XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

function SettingsPage() {
  const { user, changePassword, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { premiumStatus, isPremium, cancelPremium, loading: premiumLoading } = usePremium();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'premium', label: 'Premium', icon: Crown }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Profile Info */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h3>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="h-16 w-16 rounded-full mx-auto sm:mx-0" />
                ) : (
                  <div className="h-16 w-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                    <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <span className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</span>
                    {isPremium && (
                      <span className="inline-flex items-center px-2 py-0.5 ml-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <Crown className="h-4 w-4 mr-1 text-yellow-500" /> Premium
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{user?.email}</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-gray-700 dark:text-gray-300">Theme</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors w-full sm:w-auto"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security</h3>
              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="btn-secondary w-full sm:w-auto"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </button>
              ) : (
                <form onSubmit={handleSubmitPassword} className="space-y-4">
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
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setError(null);
                        setMessage(null);
                      }}
                      className="btn-secondary order-2 sm:order-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary order-1 sm:order-2"
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

            {/* Account Actions */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        );

      case 'premium':
        return (
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Premium Status</h3>
                {isPremium && <Crown className="h-6 w-6 text-yellow-500" />}
              </div>
              {isPremium && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span className="text-green-700 dark:text-green-300 font-semibold">You are a Premium user! Enjoy all premium features below.</span>
                </div>
              )}
              {premiumStatus ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Current Plan:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {isPremium ? 'Premium' : 'Free'}
                    </span>
                  </div>
                  {isPremium && premiumStatus.limits?.subscription_end && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Renews:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(premiumStatus.limits.subscription_end).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {/* Usage Stats */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Usage This Month</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Bills Created</span>
                          <span className="text-gray-900 dark:text-white">
                            {premiumStatus.limits?.bills_created || 0} / {premiumStatus.limits?.max_bills || '∞'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(
                                ((premiumStatus.limits?.bills_created || 0) / (premiumStatus.limits?.max_bills || 1)) * 100, 
                                100
                              )}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Templates Created</span>
                          <span className="text-gray-900 dark:text-white">
                            {premiumStatus.limits?.templates_created || 0} / {premiumStatus.limits?.max_templates || '∞'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(
                                ((premiumStatus.limits?.templates_created || 0) / (premiumStatus.limits?.max_templates || 1)) * 100, 
                                100
                              )}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                </div>
              )}
            </div>
            {/* Premium Features */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Premium Features</h3>
              <div className="space-y-3">
                {[
                  'Unlimited bills per month',
                  'Unlimited participants per bill',
                  'Unlimited templates',
                  'PDF receipt support',
                  'Receipt storage',
                  'Advanced analytics',
                  'Multiple export formats',
                  'Priority support'
                ].map((feature, idx) => (
                  <div key={idx} className={`flex items-start rounded-lg px-2 py-1 ${isPremium ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                    <CheckCircle className={`h-4 w-4 mr-3 mt-0.5 flex-shrink-0 ${isPremium ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={`text-sm ${isPremium ? 'text-green-800 dark:text-green-200 font-semibold' : 'text-gray-400'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Actions */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Manage Subscription</h3>
              {isPremium ? (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    disabled={premiumLoading}
                    className="btn-secondary w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    {premiumLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Premium
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link to="/premium" className="btn-primary w-full">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Unlock unlimited bills, PDF support, analytics, and more
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and settings</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl border border-red-200 dark:border-red-700">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold">
                  <XCircle className="h-4 w-4 mr-1" /> Warning
                </span>
              </div>
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Cancel Subscription?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                If you cancel, you’ll lose access to all premium features at the end of your current billing period.
              </p>
              <p className="text-sm text-red-500 dark:text-red-300 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex items-center justify-center btn-secondary order-2 sm:order-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-800 transition-colors font-semibold"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Keep Subscription
                </button>
                <button
                  onClick={async () => { await cancelPremium(); setShowCancelConfirm(false); }}
                  className="flex items-center justify-center order-1 sm:order-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-red-400 transition-all border-0"
                >
                  <XCircle className="h-4 w-4 mr-2 text-white" />
                  Yes, Cancel Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage; 
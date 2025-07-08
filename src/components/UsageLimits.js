import React from 'react';
import { Crown, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '../contexts/PremiumContext';

function UsageLimits({ showUpgradePrompt = true }) {
  const { premiumStatus, isPremium, loading } = usePremium();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!premiumStatus) return null;

  const { limits } = premiumStatus;

  const getUsagePercentage = (used, limit) => {
    if (limit === 999999) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600 dark:text-red-400';
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Usage & Limits
        </h3>
        {isPremium && (
          <div className="flex items-center text-yellow-600 dark:text-yellow-400">
            <Crown className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Premium</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Bills Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bills This Month
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {limits.bills.created_this_month} / {limits.bills.limit === 999999 ? '∞' : limits.bills.limit}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${getProgressColor(
                getUsagePercentage(limits.bills.created_this_month, limits.bills.limit)
              )}`}
              style={{
                width: `${getUsagePercentage(limits.bills.created_this_month, limits.bills.limit)}%`
              }}
            ></div>
          </div>
          {limits.bills.remaining === 0 && !isPremium && (
            <div className="flex items-center mt-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm">Monthly limit reached</span>
            </div>
          )}
        </div>

        {/* Participants Limit */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Participants per Bill
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Up to {limits.participants.limit === 999999 ? '∞' : limits.participants.limit}
            </span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {limits.participants.limit === 999999 ? 'Unlimited participants' : `${limits.participants.limit} participants max`}
            </span>
          </div>
        </div>

        {/* Templates Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Templates
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {limits.templates.count} / {limits.templates.limit === 999999 ? '∞' : limits.templates.limit}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${getProgressColor(
                getUsagePercentage(limits.templates.count, limits.templates.limit)
              )}`}
              style={{
                width: `${getUsagePercentage(limits.templates.count, limits.templates.limit)}%`
              }}
            ></div>
          </div>
          {limits.templates.remaining === 0 && !isPremium && (
            <div className="flex items-center mt-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm">Template limit reached</span>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Prompt */}
      {!isPremium && showUpgradePrompt && (
        <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <div className="flex items-start">
            <Crown className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-1">
                Upgrade to Premium
              </h4>
              <p className="text-sm text-primary-700 dark:text-primary-300 mb-3">
                Get unlimited bills, participants, templates, and premium features
              </p>
              <button className="btn-primary text-sm px-4 py-2" onClick={() => navigate('/premium')}>
                View Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsageLimits; 
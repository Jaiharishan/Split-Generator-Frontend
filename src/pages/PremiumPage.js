import React, { useState } from 'react';
import { Crown, Settings, CreditCard, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { usePremium } from '../contexts/PremiumContext';
import UsageLimits from '../components/UsageLimits';
import PremiumPlans from '../components/PremiumPlans';

function PremiumPage() {
  const { premiumStatus, isPremium, cancelPremium, loading } = usePremium();
  const [showPlans, setShowPlans] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancelSubscription = async () => {
    try {
      await cancelPremium();
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg mr-4">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  Premium Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage your subscription and usage
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Current Plan
                </h2>
                {isPremium && (
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium self-start sm:self-auto">
                    Premium
                  </span>
                )}
              </div>

              {isPremium ? (
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-green-900 dark:text-green-100">
                        Premium Active
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        You have access to all premium features
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Plan Details
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {premiumStatus?.limits?.subscription_plan === 'yearly' ? 'Yearly Premium' : 'Monthly Premium'}
                      </p>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Next Billing
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {premiumStatus?.limits?.subscription_expires_at 
                          ? new Date(premiumStatus.limits.subscription_expires_at).toLocaleDateString()
                          : 'No expiration date'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
                    <button
                      onClick={() => setShowPlans(true)}
                      className="btn-secondary flex items-center justify-center"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Change Plan
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="btn-outline text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-blue-900 dark:text-blue-100">
                        Free Plan
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Upgrade to unlock unlimited features
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPlans(true)}
                    className="btn-primary flex items-center justify-center w-full sm:w-auto"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </button>
                </div>
              )}
            </div>

            {/* Usage Limits */}
            <UsageLimits showUpgradePrompt={false} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Premium Features */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Premium Features
              </h3>
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
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className={`h-4 w-4 mr-3 mt-0.5 flex-shrink-0 ${
                      isPremium ? 'text-green-500' : 'text-gray-300'
                    }`} />
                    <span className={`text-sm ${
                      isPremium ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'
                    }`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Have questions about your subscription or premium features?
              </p>
              <button className="btn-outline w-full">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Plans Modal */}
      {showPlans && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <PremiumPlans onClose={() => setShowPlans(false)} />
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Cancel Subscription?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to cancel your premium subscription? You'll lose access to premium features at the end of your current billing period.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="btn-secondary order-2 sm:order-1"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="btn-outline text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20 order-1 sm:order-2"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PremiumPage; 
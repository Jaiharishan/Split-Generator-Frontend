import React, { useState, useEffect } from 'react';
import { Crown, Settings, CreditCard, Zap, CheckCircle, AlertTriangle, Users, FileText, FilePlus, FileCheck, BarChart2, Download, Star, LifeBuoy } from 'lucide-react';
import { usePremium } from '../contexts/PremiumContext';
import UsageLimits from '../components/UsageLimits';
import PremiumPlans from '../components/PremiumPlans';
import { useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';

function PremiumPage() {
  const { premiumStatus, isPremium, cancelPremium, loading } = usePremium();
  const [showPlans, setShowPlans] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show congrats modal if redirected from Stripe with success=true
    if (isPremium && location.search.includes('success=true')) {
      setShowCongrats(true);
      // Remove the query param from the URL after showing
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [isPremium, location]);

  // Confetti animation when congrats modal is shown
  useEffect(() => {
    if (showCongrats) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#facc15', '#fbbf24', '#fde68a', '#34d399', '#60a5fa'],
        scalar: 1.1,
      });
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 100,
          origin: { y: 0.4 },
          colors: ['#facc15', '#fbbf24', '#fde68a', '#34d399', '#60a5fa'],
          scalar: 0.8,
        });
      }, 400);
    }
  }, [showCongrats]);

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
      {/* Congrats Modal */}
      {showCongrats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-8 shadow-xl text-center">
            <div className="flex justify-center mb-4">
              <span className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                <Crown className="h-10 w-10 text-white animate-bounce" />
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Premium! 🎉</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Thank you for upgrading! You now have access to all advanced features and unlimited usage. Enjoy your premium experience!</p>
            <ul className="text-left space-y-2 mb-4">
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
                <li key={idx} className="flex items-center text-gray-800 dark:text-gray-200">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> {feature}
                </li>
              ))}
            </ul>
            <button
              className="btn-primary w-full"
              onClick={() => setShowCongrats(false)}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
      {/* End Congrats Modal */}
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
                {isPremium && (
                  <div className="mt-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-700 dark:text-green-300 font-semibold">You are a Premium user! Enjoy all premium features below.</span>
                  </div>
                )}
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
                      className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-red-400 transition-all border-0"
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
                {/* Enhanced feature list with icons and descriptions */}
                <div className={`flex items-start rounded-lg px-2 py-2 ${isPremium ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                  <FilePlus className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${isPremium ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <span className={`text-sm ${isPremium ? 'text-green-800 dark:text-green-200 font-semibold' : 'text-gray-400'}`}>Unlimited bills per month</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Create as many bills as you need, every month.</div>
                  </div>
                </div>
                <div className={`flex items-start rounded-lg px-2 py-2 ${isPremium ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                  <Users className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${isPremium ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <span className={`text-sm ${isPremium ? 'text-green-800 dark:text-green-200 font-semibold' : 'text-gray-400'}`}>Unlimited participants per bill</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Split with as many people as you want.</div>
                  </div>
                </div>
                <div className={`flex items-start rounded-lg px-2 py-2 ${isPremium ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                  <FileText className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${isPremium ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <span className={`text-sm ${isPremium ? 'text-green-800 dark:text-green-200 font-semibold' : 'text-gray-400'}`}>Unlimited templates</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Save and reuse as many bill templates as you need.</div>
                  </div>
                </div>
                <div className={`flex items-start rounded-lg px-2 py-2 ${isPremium ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                  <FileCheck className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${isPremium ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <span className={`text-sm ${isPremium ? 'text-green-800 dark:text-green-200 font-semibold' : 'text-gray-400'}`}>PDF receipt support</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Upload and process PDF receipts, not just images.</div>
                  </div>
                </div>
                <div className={`flex items-start rounded-lg px-2 py-2 ${isPremium ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                  <Star className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${isPremium ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <span className={`text-sm ${isPremium ? 'text-green-800 dark:text-green-200 font-semibold' : 'text-gray-400'}`}>Receipt storage</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Keep a history of all your uploaded receipts.</div>
                  </div>
                </div>
                <div className={`flex items-start rounded-lg px-2 py-2 ${isPremium ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                  <BarChart2 className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${isPremium ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <span className={`text-sm ${isPremium ? 'text-green-800 dark:text-green-200 font-semibold' : 'text-gray-400'}`}>Advanced analytics</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Get insights and breakdowns of your spending.</div>
                  </div>
                </div>
                <div className={`flex items-start rounded-lg px-2 py-2 ${isPremium ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                  <Download className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${isPremium ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <span className={`text-sm ${isPremium ? 'text-green-800 dark:text-green-200 font-semibold' : 'text-gray-400'}`}>Multiple export formats</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Export your bills as PDF, CSV, and more.</div>
                  </div>
                </div>
                <div className={`flex items-start rounded-lg px-2 py-2 ${isPremium ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                  <LifeBuoy className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${isPremium ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <span className={`text-sm ${isPremium ? 'text-green-800 dark:text-green-200 font-semibold' : 'text-gray-400'}`}>Priority support</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Get faster responses and help when you need it.</div>
                  </div>
                </div>
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={e => {
            // Only close if clicking the backdrop, not the modal itself
            if (e.target === e.currentTarget) setShowPlans(false);
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl">
            <PremiumPlans onClose={() => setShowPlans(false)} />
            {/* Improved close button for visibility */}
            <button
              onClick={() => setShowPlans(false)}
              className="absolute top-4 right-4 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-400 z-10 text-2xl font-bold"
              aria-label="Close"
              tabIndex={0}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl border border-red-200 dark:border-red-700">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold animate-pulse">
                  <AlertTriangle className="h-4 w-4 mr-1" /> Warning
                </span>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4 animate-bounce" />
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
                  onClick={handleCancelSubscription}
                  className="flex items-center justify-center order-1 sm:order-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-red-400 transition-all border-0"
                >
                  <AlertTriangle className="h-4 w-4 mr-2 text-white animate-pulse" />
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

export default PremiumPage; 
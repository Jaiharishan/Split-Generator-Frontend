import React, { useState, useEffect } from 'react';
import { Check, Crown, Zap, Star } from 'lucide-react';
import PremiumService from '../services/premiumService';
import { usePremium } from '../contexts/PremiumContext';
import { loadStripe } from '@stripe/stripe-js';

function PremiumPlans({ onClose, showUpgradePrompt = false }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [redirecting, setRedirecting] = useState(false);
  const { upgradeToPremium, isPremium, loading: upgradeLoading } = usePremium();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await PremiumService.getPlans();
      setPlans(response.data);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;
    setRedirecting(true);
    try {
      // Use the plan's interval to determine 'monthly' or 'yearly'
      const planType = selectedPlan.interval === 'year' ? 'yearly' : 'monthly';
      const result = await PremiumService.createCheckoutSession(planType);
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        setRedirecting(false);
        alert('Failed to start checkout. Please try again.');
      }
    } catch (error) {
      setRedirecting(false);
      alert('Error starting checkout. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
            <Crown className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Your Plan
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Unlock unlimited bills, participants, and premium features
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-lg border-2 p-6 transition-all ${
              selectedPlan?.id === plan.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
            } ${plan.id === 'premium_yearly' ? 'ring-2 ring-yellow-400' : ''}`}
          >
            {plan.id === 'premium_yearly' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                  Best Value
                </span>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${plan.price}
                </span>
                {plan.interval && (
                  <span className="text-gray-600 dark:text-gray-300">
                    /{plan.interval}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.id === 'free' ? (
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Current Plan
                </div>
              ) : (
                <button
                  onClick={() => setSelectedPlan(plan)}
                  disabled={upgradeLoading}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    selectedPlan?.id === plan.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {upgradeLoading && selectedPlan?.id === plan.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Upgrading...
                    </div>
                  ) : (
                    'Select Plan'
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedPlan && selectedPlan.id !== 'free' && (
        <div className="text-center">
          <button
            onClick={handleUpgrade}
            disabled={upgradeLoading || redirecting}
            className="btn-primary text-lg px-8 py-3 flex items-center justify-center mx-auto"
          >
            <Zap className="h-5 w-5 mr-2" />
            {redirecting ? 'Redirecting...' : upgradeLoading ? 'Upgrading...' : `Upgrade to ${selectedPlan.name}`}
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            You can cancel anytime
          </p>
        </div>
      )}

      {onClose && (
        // Removed internal close button to avoid overlap
        <></>
      )}
    </div>
  );
}

export default PremiumPlans; 
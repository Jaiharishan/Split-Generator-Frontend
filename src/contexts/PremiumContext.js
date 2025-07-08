import React, { createContext, useContext, useState, useEffect } from 'react';
import PremiumService from '../services/premiumService';
import { useAuth } from './AuthContext';

const PremiumContext = createContext();

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};

export const PremiumProvider = ({ children }) => {
  const { user } = useAuth();
  const [premiumStatus, setPremiumStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load premium status when user changes
  useEffect(() => {
    if (user) {
      loadPremiumStatus();
    } else {
      setPremiumStatus(null);
      setLoading(false);
    }
  }, [user]);

  const loadPremiumStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PremiumService.getStatus();
      setPremiumStatus(response.data);
    } catch (error) {
      console.error('Error loading premium status:', error);
      setError('Failed to load subscription status');
    } finally {
      setLoading(false);
    }
  };

  const upgradeToPremium = async (plan = 'monthly') => {
    try {
      setLoading(true);
      setError(null);
      const response = await PremiumService.upgrade(plan);
      await loadPremiumStatus(); // Reload status after upgrade
      return response;
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      setError('Failed to upgrade to premium');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelPremium = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PremiumService.cancel();
      await loadPremiumStatus(); // Reload status after cancellation
      return response;
    } catch (error) {
      console.error('Error cancelling premium:', error);
      setError('Failed to cancel premium subscription');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkAction = async (action, data = {}) => {
    try {
      const response = await PremiumService.checkAction(action, data);
      return response.data;
    } catch (error) {
      console.error('Error checking action:', error);
      throw error;
    }
  };

  const isPremium = premiumStatus?.limits?.subscription_status === 'premium';
  const isFree = premiumStatus?.limits?.subscription_status === 'free';

  const value = {
    premiumStatus,
    loading,
    error,
    isPremium,
    isFree,
    loadPremiumStatus,
    upgradeToPremium,
    cancelPremium,
    checkAction
  };

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
}; 
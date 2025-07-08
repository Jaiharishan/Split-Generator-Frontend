import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Users, DollarSign, Upload, Shield, Zap, ArrowRight, Crown, Check, Star, FileText, BarChart3, Download, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Github, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PremiumService from '../services/premiumService';

function LandingPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadPlans();
    setIsVisible(true);
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

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-800/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 dark:opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-800/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 dark:opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 dark:bg-pink-800/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 dark:opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div 
            className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-primary-100 dark:bg-primary-900/50 rounded-full transform hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-primary-900/20">
                <Receipt className="h-12 w-12 text-primary-600 dark:text-primary-300" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Split Bills
              <span className="text-primary-600 dark:text-primary-300 bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent"> Effortlessly</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload receipts, add participants, and automatically calculate who owes what. 
              Perfect for roommates, friends, and group expenses.
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="btn-primary text-lg px-8 py-4 flex items-center justify-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-primary-900/30"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/bills"
                  className="btn-primary text-lg px-8 py-4 flex items-center justify-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-primary-900/30"
                >
                  Go to Your Bills
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/premium"
                  className="btn-secondary text-lg px-8 py-4 flex items-center justify-center transform hover:scale-105 transition-all duration-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <Crown className="mr-2 h-5 w-5" />
                  Upgrade to Premium
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white dark:bg-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to split bills
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-200">
              Powerful features to make bill splitting simple and accurate
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm dark:shadow-blue-900/20">
                  <Upload className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Upload Receipts
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Simply upload photos or PDFs of your receipts. Our OCR technology automatically extracts items and prices.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm dark:shadow-green-900/20">
                  <Users className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Add Participants
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Invite friends and roommates to split bills. Assign items to specific people or split everything equally.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm dark:shadow-purple-900/20">
                  <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Automatic Calculations
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Get instant totals for each person. See exactly who owes what and settle up easily.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6 group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm dark:shadow-yellow-900/20">
                  <Zap className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Process receipts in seconds, not minutes. Get your split calculations instantly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6 group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm dark:shadow-red-900/20">
                  <Shield className="h-8 w-8 text-red-600 dark:text-red-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Your data is encrypted and secure. Only you and your invited participants can see your bills.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6 group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm dark:shadow-indigo-900/20">
                  <Receipt className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Bill History
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Keep track of all your past bills. Never lose track of who paid what.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Features Section */}
      <div className="py-24 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-400 rounded-full transform hover:rotate-12 transition-transform duration-300 shadow-lg">
                <Crown className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Unlock Premium Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-200">
              Take your bill splitting to the next level with premium features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Premium Feature 1 */}
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm dark:shadow-yellow-900/20">
                  <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                PDF Receipts
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-200">
                Upload PDF receipts and get even better OCR accuracy
              </p>
            </div>

            {/* Premium Feature 2 */}
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm dark:shadow-blue-900/20">
                  <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Advanced Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-200">
                Track spending patterns and get insights into your group expenses
              </p>
            </div>

            {/* Premium Feature 3 */}
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm dark:shadow-green-900/20">
                  <Download className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Multiple Export Formats
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-200">
                Export bills as PDF, CSV, or Excel for record keeping
              </p>
            </div>

            {/* Premium Feature 4 */}
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm dark:shadow-purple-900/20">
                  <Star className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Priority Support
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-200">
                Get faster support and dedicated help when you need it
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      {!loading && plans.length > 0 && (
        <div className="py-24 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-200">
                Start free, upgrade when you need more
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`relative rounded-lg border-2 p-8 transition-all duration-500 hover:shadow-xl transform hover:-translate-y-2 ${
                    plan.id === 'premium_yearly' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-200 dark:ring-primary-800' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-400'
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {plan.id === 'premium_yearly' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary-600 dark:bg-primary-400 text-white dark:text-gray-900 px-4 py-1 rounded-full text-sm font-semibold animate-pulse">
                        Best Value
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${plan.price}
                      </span>
                      {plan.interval && (
                        <span className="text-gray-600 dark:text-gray-300">
                          /{plan.interval}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 text-left">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-200">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {plan.id === 'free' ? (
                      <Link
                        to="/login"
                        className="w-full btn-secondary py-3 transform hover:scale-105 transition-transform duration-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        Get Started Free
                      </Link>
                    ) : (
                      <Link
                        to="/premium"
                        className="w-full btn-primary py-3 transform hover:scale-105 transition-transform duration-300"
                      >
                        Choose {plan.name}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* How it Works Section */}
      <div className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-200">
              Three simple steps to split any bill
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 text-white dark:text-gray-900 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Upload Receipt
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Take a photo or upload a PDF of your receipt. Our AI will extract all the items and prices automatically.
              </p>
            </div>

            <div className="text-center group">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 text-white dark:text-gray-900 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Add Participants
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Invite your friends or roommates. Assign specific items to people or split everything equally.
              </p>
            </div>

            <div className="text-center group">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 text-white dark:text-gray-900 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Get Results
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Instantly see who owes what. Share the results with your group and settle up easily.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-primary-600 dark:bg-primary-700 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-700 dark:to-purple-700 opacity-90"></div>
          <div className="absolute top-10 right-10 w-20 h-20 bg-white opacity-10 dark:opacity-5 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-white opacity-5 dark:opacity-3 rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to simplify your bill splitting?
          </h2>
          <p className="text-xl text-primary-100 dark:text-primary-200 mb-8">
            Join thousands of users who are already saving time and avoiding awkward money conversations.
          </p>
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center bg-white text-primary-600 dark:text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/premium"
                className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 dark:hover:text-primary-700 transition-all duration-300 transform hover:scale-105"
              >
                <Crown className="mr-2 h-5 w-5" />
                View Premium Plans
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/bills"
                className="inline-flex items-center bg-white text-primary-600 dark:text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Go to Your Bills
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/premium"
                className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 dark:hover:text-primary-700 transition-all duration-300 transform hover:scale-105"
              >
                <Crown className="mr-2 h-5 w-5" />
                Upgrade to Premium
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <Receipt className="h-8 w-8 text-primary-400 mr-2" />
                <span className="text-xl font-bold">Split Generator</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Making bill splitting simple, fair, and hassle-free. Join thousands of users who trust us to handle their group expenses.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/bills" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Your Bills
                  </Link>
                </li>
                <li>
                  <Link to="/premium" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Premium Features
                  </Link>
                </li>
                <li>
                  <Link to="/templates" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Bill Templates
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Settings
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center text-gray-400 mb-4 md:mb-0">
                <span>© 2024 Split Generator. Made with</span>
                <Heart className="h-4 w-4 text-red-500 mx-1" />
                <span>for better bill splitting.</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>Made with React & Node.js</span>
                <span>•</span>
                <span>Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default LandingPage; 
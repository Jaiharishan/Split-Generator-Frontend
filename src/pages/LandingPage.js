import React from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Users, DollarSign, Upload, Shield, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-primary-100 dark:bg-primary-900 rounded-full">
                <Receipt className="h-12 w-12 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Split Bills
              <span className="text-primary-600 dark:text-primary-400"> Effortlessly</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Upload receipts, add participants, and automatically calculate who owes what. 
              Perfect for roommates, friends, and group expenses.
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="btn-primary text-lg px-8 py-4 flex items-center justify-center"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/bills"
                  className="btn-primary text-lg px-8 py-4 flex items-center justify-center"
                >
                  Go to Your Bills
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to split bills
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Powerful features to make bill splitting simple and accurate
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Upload Receipts
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Simply upload photos or PDFs of your receipts. Our OCR technology automatically extracts items and prices.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Add Participants
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Invite friends and roommates to split bills. Assign items to specific people or split everything equally.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Automatic Calculations
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant totals for each person. See exactly who owes what and settle up easily.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <Zap className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Process receipts in seconds, not minutes. Get your split calculations instantly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your data is encrypted and secure. Only you and your invited participants can see your bills.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                  <Receipt className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Bill History
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Keep track of all your past bills. Never lose track of who paid what.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Three simple steps to split any bill
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Upload Receipt
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Take a photo or upload a PDF of your receipt. Our AI will extract all the items and prices automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Add Participants
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Invite your friends or roommates. Assign specific items to people or split everything equally.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Get Results
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Instantly see who owes what. Share the results with your group and settle up easily.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to simplify your bill splitting?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of users who are already saving time and avoiding awkward money conversations.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Splitting Bills
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Receipt className="h-8 w-8 text-primary-400 mr-2" />
            <span className="text-xl font-bold">Split Generator</span>
          </div>
          <p className="text-gray-400 dark:text-gray-400">
            © 2024 Split Generator. Making bill splitting simple and fair.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage; 
import React from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Users, DollarSign, Upload, Zap, Shield, Smartphone } from 'lucide-react';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-full">
                <Receipt className="h-12 w-12 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Split Bills
              <span className="text-primary-600 dark:text-primary-400"> Smartly</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Upload receipts, automatically extract items, and split grocery bills with friends. 
              No more manual calculations or awkward money exchanges.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create"
                className="btn-primary text-lg px-8 py-3"
              >
                <Upload className="h-5 w-5 mr-2" />
                Start Splitting Bills
              </Link>
              <Link
                to="/bills"
                className="btn-secondary text-lg px-8 py-3"
              >
                View My Bills
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple, fast, and accurate bill splitting in three easy steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">1. Upload Receipt</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Take a photo or upload an image of your grocery receipt. 
                Our AI automatically extracts all items and prices.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2. Add Participants</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Add your friends or roommates and assign items to each person. 
                One item can be split between multiple people.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">3. Get Results</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Instantly see who owes what. Perfect for roommates, 
                friends, or any group splitting expenses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Split Generator?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built for modern sharing economy with privacy and ease in mind
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <Zap className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Process receipts in seconds with advanced OCR technology
              </p>
            </div>
            
            <div className="text-center p-6">
              <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">100% Private</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                All processing happens in your browser. Your data never leaves your device
              </p>
            </div>
            
            <div className="text-center p-6">
              <Smartphone className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Mobile Friendly</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Works perfectly on phones, tablets, and computers
              </p>
            </div>
            
            <div className="text-center p-6">
              <Receipt className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Parsing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Automatically detects products, prices, and quantities
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 dark:bg-primary-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Simplify Your Bill Splitting?
          </h2>
          <p className="text-xl text-primary-100 dark:text-primary-200 mb-8">
            Join thousands of users who've made bill splitting effortless
          </p>
          <Link
            to="/create"
            className="bg-white dark:bg-gray-100 text-primary-600 dark:text-primary-700 hover:bg-gray-100 dark:hover:bg-gray-200 px-8 py-3 rounded-md font-semibold text-lg transition-colors inline-flex items-center"
          >
            <Upload className="h-5 w-5 mr-2" />
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 dark:bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Receipt className="h-6 w-6 text-primary-400 mr-2" />
              <span className="text-white font-semibold text-lg">Split Generator</span>
            </div>
            <p className="text-gray-400 dark:text-gray-400 text-sm">
              © 2024 Split Generator. Making bill splitting simple and fair.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage; 
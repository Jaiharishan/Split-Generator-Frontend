import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Receipt, Users, DollarSign } from 'lucide-react';
import { billService } from '../services/billService';
import { usePremium } from '../contexts/PremiumContext';
import UsageLimits from '../components/UsageLimits';

function BillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { premiumStatus, isPremium } = usePremium();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const data = await billService.getAllBills();
      setBills(data);
    } catch (err) {
      setError('Failed to fetch bills');
      console.error('Error fetching bills:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateTotal = (bill) => {
    return bill.products?.reduce((sum, product) => sum + (product.price || 0), 0) || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading bills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-danger-600 dark:text-danger-400 mb-4">{error}</p>
          <button
            onClick={fetchBills}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Bills</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage and split your grocery bills with friends</p>
          </div>
          <Link to="/create" className="btn-primary flex items-center h-12 sm:h-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create New Bill
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {bills.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No bills yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Create your first bill to get started</p>
                <Link to="/create" className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Bill
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {bills.map((bill) => (
                  <div key={bill.id} className="card hover:shadow-md transition-shadow">
                    <div className="card-header">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {bill.title}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(bill.created_at)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{bill.participant_count || 0} participants</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Receipt className="h-4 w-4 mr-2" />
                          <span>{bill.product_count || 0} items</span>
                        </div>
                        
                        <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>${calculateTotal(bill).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <Link
                          to={`/bill/${bill.id}`}
                          className="btn-primary w-full text-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UsageLimits />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillsPage; 
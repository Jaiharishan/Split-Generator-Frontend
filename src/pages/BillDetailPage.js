import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Users, Receipt, Trash2, Edit, Download } from 'lucide-react';
import { billService } from '../services/billService';
import { exportService } from '../services/exportService';

function BillDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    try {
      setLoading(true);
      const [billData, summaryData] = await Promise.all([
        billService.getBillById(id),
        billService.getBillSummary(id)
      ]);
      setBill(billData);
      setSummary(summaryData);
    } catch (err) {
      setError('Failed to fetch bill details');
      console.error('Error fetching bill:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBill = async () => {
    if (!window.confirm('Are you sure you want to delete this bill? This action cannot be undone.')) {
      return;
    }

    try {
      await billService.deleteBill(id);
      alert('Bill deleted successfully');
      navigate('/bills');
    } catch (error) {
      console.error('Error deleting bill:', error);
      alert('Failed to delete bill. Please try again.');
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const filename = `${bill.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
      const result = await exportService.exportBillAsText(id, filename);
      
      if (result.success) {
        alert('Bill exported successfully!');
      } else {
        alert('Failed to export bill: ' + result.error);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export bill. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const filename = `${bill.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      const result = await exportService.exportBillAsCSV(id, filename);
      
      if (result.success) {
        alert('Bill exported as CSV successfully!');
      } else {
        alert('Failed to export CSV: ' + result.error);
      }
    } catch (error) {
      console.error('CSV Export error:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to safely get participant name
  const getParticipantName = (participant) => {
    if (typeof participant === 'string') return participant;
    if (participant && typeof participant === 'object') return participant.name || 'Unknown';
    return 'Unknown';
  };

  // Helper function to safely get participant color
  const getParticipantColor = (participant) => {
    if (participant && typeof participant === 'object') return participant.color || '#3B82F6';
    return '#3B82F6';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading bill details...</p>
        </div>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-danger-600 dark:text-danger-400 mb-4">{error || 'Bill not found'}</p>
          <button
            onClick={() => navigate('/bills')}
            className="btn-primary"
          >
            Back to Bills
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/bills')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bills
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">{bill.title}</h1>
              {bill.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-2">{bill.description}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Created on {formatDate(bill.created_at)}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <button
                onClick={handleExport}
                disabled={exporting}
                className="btn-secondary flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export'}
              </button>
              <button
                onClick={handleExportCSV}
                disabled={exporting}
                className="btn-secondary flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export CSV'}
              </button>
              <button
                onClick={() => navigate(`/bill/${id}/edit`)}
                className="btn-secondary flex items-center justify-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDeleteBill}
                className="btn-danger flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Participants */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Participants ({bill.participants?.length || 0})
                </h2>
              </div>
              <div className="card-body">
                <div className="flex flex-wrap gap-2">
                  {bill.participants?.map((participant, index) => (
                    <span
                      key={participant.id || index}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium"
                      style={{ backgroundColor: getParticipantColor(participant) + '20', color: getParticipantColor(participant) }}
                    >
                      {getParticipantName(participant)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Receipt className="h-5 w-5 mr-2" />
                  Products ({bill.products?.length || 0})
                </h2>
              </div>
              <div className="card-body">
                {bill.products?.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No products added to this bill.</p>
                ) : (
                  <div className="space-y-4">
                    {bill.products?.map((product, index) => (
                      <div key={product.id || index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <h3 className="font-medium text-gray-900 dark:text-white break-words">{product.name}</h3>
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            ${(product.price || 0).toFixed(2)}
                          </span>
                        </div>
                        
                        {product.participants?.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Split between:</p>
                            <div className="flex flex-wrap gap-2">
                              {product.participants.map((participant, pIndex) => (
                                <span
                                  key={participant.id || pIndex}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                                >
                                  {getParticipantName(participant)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Bill Summary */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Bill Summary
                </h2>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Total Amount:</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ${(summary?.bill_total || 0).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Number of Items:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {bill.products?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Participants:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {bill.participants?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Totals */}
            {summary?.participants && summary.participants.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Individual Totals</h2>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    {summary.participants.map((participant) => (
                      <div key={participant.id} className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300 break-words">{participant.name}:</span>
                        <span className="font-semibold text-gray-900 dark:text-white ml-2">
                          ${(participant.total_amount || 0).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillDetailPage; 
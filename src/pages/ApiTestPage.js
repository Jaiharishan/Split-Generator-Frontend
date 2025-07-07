import React, { useState } from 'react';
import { Play, Check, X, RotateCcw, FileText, Database, Upload } from 'lucide-react';

function ApiTestPage() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [testData, setTestData] = useState({
    billTitle: 'Test Grocery Bill',
    billDescription: 'Test bill for API testing',
    participants: ['Alice', 'Bob', 'Charlie'],
    products: [
      { name: 'Milk', price: 3.99, participants: ['Alice', 'Bob'] },
      { name: 'Bread', price: 2.49, participants: ['Bob', 'Charlie'] },
      { name: 'Apples', price: 4.99, participants: ['Alice', 'Charlie'] }
    ]
  });

  const API_BASE = 'http://localhost:5000/api';

  const runTest = async (testName, testFunction) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    setResults(prev => ({ ...prev, [testName]: null }));

    try {
      const result = await testFunction();
      setResults(prev => ({ 
        ...prev, 
        [testName]: { success: true, data: result, timestamp: new Date().toISOString() }
      }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: false, 
          error: error.message, 
          timestamp: new Date().toISOString() 
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const clearResults = () => {
    setResults({});
  };

  // Test functions
  const tests = {
    'Health Check': async () => {
      const response = await fetch(`${API_BASE}/health`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    },

    'Get All Bills': async () => {
      const response = await fetch(`${API_BASE}/bills`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    },

    'Create Bill': async () => {
      const billData = {
        title: testData.billTitle,
        total_amount: testData.products.reduce((sum, p) => sum + p.price, 0),
        participants: testData.participants
      };

      const response = await fetch(`${API_BASE}/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      
      // Store the created bill ID for other tests
      if (result.id) {
        localStorage.setItem('testBillId', result.id);
      }

      return result;
    },

    'Get Bill by ID': async () => {
      const billId = localStorage.getItem('testBillId');
      if (!billId) throw new Error('No bill ID available. Run "Create Bill" test first.');

      const response = await fetch(`${API_BASE}/bills/${billId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    },

    'Get Bill Summary': async () => {
      const billId = localStorage.getItem('testBillId');
      if (!billId) throw new Error('No bill ID available. Run "Create Bill" test first.');

      const response = await fetch(`${API_BASE}/bills/${billId}/summary`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    },

    'Add Product to Bill': async () => {
      const billId = localStorage.getItem('testBillId');
      if (!billId) throw new Error('No bill ID available. Run "Create Bill" test first.');

      const productData = {
        name: 'Test Product',
        price: 9.99,
        quantity: 1,
        participant_ids: [] // Will be populated after getting participants
      };

      const response = await fetch(`${API_BASE}/bills/${billId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
      }

      return await response.json();
    },

    'Update Bill': async () => {
      const billId = localStorage.getItem('testBillId');
      if (!billId) throw new Error('No bill ID available. Run "Create Bill" test first.');

      const updateData = {
        title: 'Updated Test Bill',
        total_amount: 25.00
      };

      const response = await fetch(`${API_BASE}/bills/${billId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
      }

      return await response.json();
    },

    'Delete Bill': async () => {
      const billId = localStorage.getItem('testBillId');
      if (!billId) throw new Error('No bill ID available. Run "Create Bill" test first.');

      const response = await fetch(`${API_BASE}/bills/${billId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      
      // Clear the stored bill ID after deletion
      localStorage.removeItem('testBillId');
      
      return result;
    }
  };

  const runAllTests = async () => {
    for (const [testName, testFunction] of Object.entries(tests)) {
      await runTest(testName, testFunction);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">API Testing Interface</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test all API endpoints to ensure they're working correctly
          </p>
        </div>

        {/* Control Panel */}
        <div className="card mb-8">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Test Controls
            </h2>
          </div>
          <div className="card-body">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={runAllTests}
                className="btn-primary"
                disabled={Object.values(loading).some(Boolean)}
              >
                <Play className="h-4 w-4 mr-2" />
                Run All Tests
              </button>
              <button
                onClick={clearResults}
                className="btn-secondary"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear Results
              </button>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-6">
          {Object.entries(tests).map(([testName, testFunction]) => (
            <div key={testName} className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{testName}</h3>
                  <button
                    onClick={() => runTest(testName, testFunction)}
                    disabled={loading[testName]}
                    className="btn-primary text-sm"
                  >
                    {loading[testName] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Test
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="card-body">
                {results[testName] && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      {results[testName].success ? (
                        <Check className="h-5 w-5 text-success-600" />
                      ) : (
                        <X className="h-5 w-5 text-danger-600" />
                      )}
                      <span className={`font-medium ${
                        results[testName].success 
                          ? 'text-success-600 dark:text-success-400' 
                          : 'text-danger-600 dark:text-danger-400'
                      }`}>
                        {results[testName].success ? 'Success' : 'Failed'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(results[testName].timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Response:</span>
                      </div>
                      <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap">
                        {results[testName].success 
                          ? (typeof results[testName].data === 'object' 
                              ? JSON.stringify(results[testName].data, null, 2)
                              : String(results[testName].data))
                          : String(results[testName].error)
                        }
                      </pre>
                    </div>
                  </div>
                )}
                
                {!results[testName] && !loading[testName] && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    Click "Run Test" to execute this endpoint
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Test Data Info */}
        <div className="card mt-8">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Test Data</h2>
          </div>
          <div className="card-body">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Bill Information</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <p><strong>Title:</strong> {testData.billTitle}</p>
                  <p><strong>Description:</strong> {testData.billDescription}</p>
                  <p><strong>Total Amount:</strong> ${testData.products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Participants</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  {testData.participants.map((participant, index) => (
                    <p key={index}>• {participant}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiTestPage; 
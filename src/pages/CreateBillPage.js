import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, X, Save, Trash2, User, Users, DollarSign, FileText, ChevronDown, Check } from 'lucide-react';
import { billService } from '../services/billService';
import { templateService } from '../services/templateService';
import ReceiptParser from '../components/ReceiptParser';

function CreateBillPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    participants: [''],
    products: []
  });
  const [template, setTemplate] = useState(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Load template if specified in URL
  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      loadTemplate(templateId);
    }
  }, [searchParams]);

  // Fetch templates for modal
  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const data = await templateService.getTemplates();
      setTemplates(data);
    } catch (err) {
      setTemplates([]);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const openTemplateModal = () => {
    fetchTemplates();
    setShowTemplateModal(true);
  };

  const closeTemplateModal = () => {
    setShowTemplateModal(false);
  };

  const handleChooseTemplate = async (templateId) => {
    await loadTemplate(templateId);
    setShowTemplateModal(false);
  };

  const loadTemplate = async (templateId) => {
    try {
      setLoadingTemplate(true);
      const templateData = await templateService.getTemplate(templateId);
      setTemplate(templateData);
      
      // Pre-fill form with template data
      setFormData(prev => ({
        ...prev,
        participants: templateData.participants.map(p => p.name)
      }));
    } catch (error) {
      console.error('Error loading template:', error);
      alert('Failed to load template');
    } finally {
      setLoadingTemplate(false);
    }
  };

  // Calculate totals for each participant
  const participantTotals = useMemo(() => {
    const totals = {};
    const validParticipants = formData.participants.filter(p => p.trim());
    
    // Initialize totals for each participant
    validParticipants.forEach(participant => {
      totals[participant] = 0;
    });

    // Calculate totals based on product assignments
    formData.products.forEach(product => {
      if (product.participants && product.participants.length > 0) {
        const pricePerPerson = product.price / product.participants.length;
        product.participants.forEach(participant => {
          if (totals[participant] !== undefined) {
            totals[participant] += pricePerPerson;
          }
        });
      }
    });

    return totals;
  }, [formData.participants, formData.products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParticipantChange = (index, value) => {
    const newParticipants = [...formData.participants];
    newParticipants[index] = value;
    setFormData(prev => ({
      ...prev,
      participants: newParticipants
    }));
  };

  const addParticipant = () => {
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, '']
    }));
  };

  const removeParticipant = (index) => {
    if (formData.participants.length > 1) {
      const newParticipants = formData.participants.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        participants: newParticipants
      }));
    }
  };

  const handleProductsExtracted = (products) => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, ...products]
    }));
  };

  const clearAllProducts = () => {
    if (window.confirm('Are you sure you want to clear all products? This action cannot be undone.')) {
      setFormData(prev => ({
        ...prev,
        products: []
      }));
    }
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, {
        name: '',
        price: 0,
        participants: []
      }]
    }));
  };

  const updateProduct = (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index] = {
      ...newProducts[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      products: newProducts
    }));
  };

  const removeProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const toggleProductParticipant = (productIndex, participantIndex) => {
    const newProducts = [...formData.products];
    const product = newProducts[productIndex];
    const participant = formData.participants[participantIndex];
    
    if (product.participants.includes(participant)) {
      product.participants = product.participants.filter(p => p !== participant);
    } else {
      product.participants = [...product.participants, participant];
    }
    
    setFormData(prev => ({
      ...prev,
      products: newProducts
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a bill title');
      return;
    }

    if (formData.participants.some(p => !p.trim())) {
      alert('Please fill in all participant names');
      return;
    }

    try {
      setLoading(true);
      
      // Calculate total amount from products
      const totalAmount = formData.products.reduce((sum, product) => sum + (product.price || 0), 0);
      
      // Prepare data in the format expected by the server
      const billData = {
        title: formData.title.trim(),
        total_amount: totalAmount,
        participants: formData.participants.filter(p => p.trim())
      };

      console.log('Creating bill with data:', billData);
      
      const newBill = await billService.createBill(billData);
      console.log('Bill created successfully:', newBill);
      
      // If there are products, we need to add them after bill creation
      const validProducts = formData.products.filter(p => p.name.trim() && p.price > 0);
      
      if (validProducts.length > 0) {
        // Get the created bill to get participant IDs
        const createdBill = await billService.getBillById(newBill.id);
        
        // Add each product to the bill
        for (const product of validProducts) {
          const productData = {
            name: product.name.trim(),
            price: product.price,
            quantity: 1,
            participant_ids: [] // We'll need to map participant names to IDs
          };
          
          // Map participant names to IDs for this product
          if (product.participants && product.participants.length > 0) {
            const participantIds = [];
            for (const participantName of product.participants) {
              const participant = createdBill.participants.find(p => p.name === participantName);
              if (participant) {
                participantIds.push(participant.id);
              }
            }
            productData.participant_ids = participantIds;
          }
          
          await billService.addProduct(newBill.id, productData);
        }
      }
      
      navigate(`/bill/${newBill.id}`);
    } catch (error) {
      console.error('Error creating bill:', error);
      let errorMessage = 'Failed to create bill. Please try again.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validParticipants = formData.participants.filter(p => p.trim());
  const totalBillAmount = formData.products.reduce((sum, product) => sum + product.price, 0);
  const totalAssignedAmount = Object.values(participantTotals).reduce((sum, total) => sum + total, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Bill</h1>
              <p className="text-gray-600 dark:text-gray-300">Upload a receipt or manually add items to split with friends</p>
            </div>
            <div>
              <button
                type="button"
                onClick={openTemplateModal}
                className="btn-secondary flex items-center"
              >
                <FileText className="h-5 w-5 mr-2" />
                {template ? 'Change Template' : 'Choose Template'}
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          {/* Template Indicator */}
          {template && (
            <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
                    Using template: {template.name}
                  </p>
                  {template.description && (
                    <p className="text-xs text-primary-600 dark:text-primary-300 mt-1">
                      {template.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Template Picker Modal */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Choose a Template</h2>
                  <button onClick={closeTemplateModal} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {loadingTemplates ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No templates found. <br />
                    <span className="text-sm">Create a template from the Templates page.</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleChooseTemplate(t.id)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors flex items-center justify-between ${template && template.id === t.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        <div>
                          <div className="flex items-center mb-1">
                            <FileText className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-2" />
                            <span className="font-medium text-gray-900 dark:text-white">{t.name}</span>
                            {template && template.id === t.id && <Check className="h-4 w-4 text-primary-600 ml-2" />}
                          </div>
                          {t.description && <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">{t.description}</div>}
                          <div className="flex flex-wrap gap-2 mt-1">
                            {t.participants && t.participants.length > 0 && t.participants.map((p, i) => (
                              <span key={i} className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                                {p.name || p}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bill Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., Grocery Shopping Trip"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input"
                  rows={3}
                  placeholder="Optional description..."
                />
              </div>
            </div>
          </div>

          {/* Receipt Parser */}
          <ReceiptParser onProductsExtracted={handleProductsExtracted} />

          {/* Participants Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Participants Input */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Participants
                </h2>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {formData.participants.map((participant, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                      <input
                        type="text"
                        value={participant}
                        onChange={(e) => handleParticipantChange(index, e.target.value)}
                        className="input flex-1"
                        placeholder="Enter participant name"
                        required
                      />
                      {formData.participants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParticipant(index)}
                          className="flex-shrink-0 p-2 text-danger-600 hover:text-danger-700 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-full transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addParticipant}
                    className="w-full btn-secondary text-sm py-3"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Participant
                  </button>
                </div>
              </div>
            </div>

            {/* Participant Totals */}
            {validParticipants.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Participant Totals
                  </h2>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    {validParticipants.map((participant, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{participant}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            ${participantTotals[participant]?.toFixed(2) || '0.00'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {participantTotals[participant] > 0 ? 'Owes' : 'No items assigned'}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Summary */}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Total Bill Amount:</span>
                        <span className="font-medium text-gray-900 dark:text-white">${totalBillAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Total Assigned:</span>
                        <span className="font-medium text-gray-900 dark:text-white">${totalAssignedAmount.toFixed(2)}</span>
                      </div>
                      {totalBillAmount > 0 && totalAssignedAmount !== totalBillAmount && (
                        <div className="flex justify-between text-sm">
                          <span className="text-warning-600 dark:text-warning-400">Unassigned Amount:</span>
                          <span className="font-medium text-warning-600 dark:text-warning-400">
                            ${(totalBillAmount - totalAssignedAmount).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Products */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Products</h2>
                {formData.products.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllProducts}
                    className="flex items-center text-sm text-danger-600 hover:text-danger-700 dark:text-danger-400 dark:hover:text-danger-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear All Products
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              {formData.products.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No products added yet. Upload a receipt or add products manually.
                </p>
              ) : (
                <div className="space-y-4">
                  {formData.products.map((product, productIndex) => (
                    <div key={productIndex} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => updateProduct(productIndex, 'name', e.target.value)}
                          className="input flex-1"
                          placeholder="Product name"
                        />
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => updateProduct(productIndex, 'price', parseFloat(e.target.value) || 0)}
                          className="input w-24"
                          placeholder="Price"
                          step="0.01"
                          min="0"
                        />
                        <button
                          type="button"
                          onClick={() => removeProduct(productIndex)}
                          className="text-danger-600 hover:text-danger-700 dark:text-danger-400 dark:hover:text-danger-300 p-2 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-full transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Split between:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {validParticipants.map((participant, participantIndex) => (
                            <button
                              key={participantIndex}
                              type="button"
                              onClick={() => toggleProductParticipant(productIndex, participantIndex)}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                product.participants.includes(participant)
                                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {participant}
                            </button>
                          ))}
                        </div>
                        {product.participants.length > 0 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ${product.price.toFixed(2)} ÷ {product.participants.length} = ${(product.price / product.participants.length).toFixed(2)} each
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                type="button"
                onClick={addProduct}
                className="btn-secondary text-sm mt-4"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Product
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Bill
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBillPage; 
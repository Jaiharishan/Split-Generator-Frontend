import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, FileText, Calendar, ArrowRight } from 'lucide-react';
import { templateService } from '../services/templateService';

function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    participants: []
  });
  const [newParticipant, setNewParticipant] = useState({ name: '', color: '#FF6B6B' });

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await templateService.getTemplates();
      setTemplates(data);
    } catch (error) {
      setError('Failed to fetch templates');
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addParticipant = () => {
    if (newParticipant.name.trim()) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, { ...newParticipant, id: Date.now() }]
      }));
      setNewParticipant({ name: '', color: colors[Math.floor(Math.random() * colors.length)] });
    }
  };

  const removeParticipant = (index) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Template name is required');
      return;
    }
    if (!editingTemplate && formData.participants.length === 0) {
      setError('At least one participant is required');
      return;
    }

    try {
      setError(null);
      
      if (editingTemplate) {
        await templateService.updateTemplate(editingTemplate.id, formData);
      } else {
        await templateService.createTemplate(formData);
      }
      
      setShowCreateModal(false);
      setEditingTemplate(null);
      resetForm();
      fetchTemplates();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save template');
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || '',
      participants: template.participants || []
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await templateService.deleteTemplate(templateId);
        fetchTemplates();
      } catch (error) {
        setError('Failed to delete template');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      participants: []
    });
    setNewParticipant({ name: '', color: colors[0] });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Bill Templates</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Save and reuse participant groups for quick bill creation
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
          >
            <Plus className="h-5 w-5" />
            <span>Create Template</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No templates yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first template to save time when creating bills with the same group of people.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {template.name}
                    </h3>
                    {template.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                        {template.description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-3 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(template)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      aria-label="Edit template"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      aria-label="Delete template"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{template.participant_count || 0} participants</span>
                </div>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Created {formatDate(template.created_at)}</span>
                </div>

                <Link
                  to={`/create-bill?template=${template.id}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium transition-colors"
                >
                  Use Template
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {editingTemplate ? 'Edit Template' : 'Create Template'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="e.g., Roommates, Family, Work Team"
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
                      className="input w-full"
                      rows="3"
                      placeholder="Optional description of this template"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Participants{!editingTemplate && ' *'}
                    </label>
                    
                    {/* Add Participant */}
                    <div className="flex flex-col sm:flex-row gap-2 mb-3">
                      <input
                        type="text"
                        value={newParticipant.name}
                        onChange={(e) => setNewParticipant(prev => ({ ...prev, name: e.target.value }))}
                        className="input flex-1"
                        placeholder="Participant name"
                      />
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={newParticipant.color}
                          onChange={(e) => setNewParticipant(prev => ({ ...prev, color: e.target.value }))}
                          className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={addParticipant}
                          className="px-3 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Participants List */}
                    <div className="space-y-2">
                      {formData.participants.map((participant, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <div
                              className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{ backgroundColor: participant.color }}
                            />
                            <span className="text-sm text-gray-900 dark:text-white truncate">
                              {participant.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeParticipant(index)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setEditingTemplate(null);
                        resetForm();
                      }}
                      className="btn-secondary order-2 sm:order-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary order-1 sm:order-2"
                    >
                      {editingTemplate ? 'Update Template' : 'Create Template'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplatesPage; 
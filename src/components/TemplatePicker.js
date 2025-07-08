import React from 'react';
import { X, FileText, Users } from 'lucide-react';

const TemplatePicker = ({ templates = [], onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Choose a Template
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="h-5 w-5 text-gray-500 dark:text-gray-300" />
          </button>
        </div>
        <div className="p-6">
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">No templates found.</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Create a template from the Templates page.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onSelect(template)}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex flex-col gap-2"
                >
                  <div className="flex items-center mb-1">
                    <FileText className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white text-base">{template.title || template.name}</span>
                  </div>
                  {template.description && (
                    <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">{template.description}</div>
                  )}
                  {template.participants && template.participants.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {template.participants.map((p, i) => (
                        <span key={i} className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {p.name || p}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplatePicker; 
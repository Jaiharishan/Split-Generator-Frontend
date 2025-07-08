import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  text = '',
  fullScreen = false 
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'border-primary-600 dark:border-primary-400',
    white: 'border-white',
    gray: 'border-gray-600 dark:border-gray-400',
    red: 'border-red-600 dark:border-red-400',
    green: 'border-green-600 dark:border-green-400',
    blue: 'border-blue-600 dark:border-blue-400'
  };

  const spinner = (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <div
          className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
        />
        {text && (
          <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Predefined loading components for common use cases
export const ButtonSpinner = ({ size = 'sm', className = '' }) => (
  <LoadingSpinner size={size} color="white" className={className} />
);

export const PageSpinner = ({ text = 'Loading...' }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <LoadingSpinner size="xl" text={text} />
  </div>
);

export const CardSpinner = ({ text = 'Loading...' }) => (
  <div className="card">
    <div className="card-body">
      <LoadingSpinner size="lg" text={text} />
    </div>
  </div>
);

export default LoadingSpinner; 
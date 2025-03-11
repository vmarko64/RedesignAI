import React from 'react';

/**
 * Loading spinner component with optional text
 */
function LoadingSpinner({ size = 'medium', text }) {
  const sizes = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`
          ${sizes[size]} 
          rounded-full 
          border-primary-500/20 
          border-t-primary-500 
          animate-spin
        `}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-400">{text}</p>
      )}
    </div>
  );
}

export default LoadingSpinner; 
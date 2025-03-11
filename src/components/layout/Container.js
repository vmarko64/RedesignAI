import React from 'react';

/**
 * Container component for consistent layout across pages
 */
function Container({ children, className = '', size = 'default' }) {
  const sizes = {
    small: 'max-w-2xl',
    default: 'max-w-4xl',
    large: 'max-w-6xl',
    full: 'max-w-full'
  };
  
  return (
    <div className="flex-1 w-full bg-dark-900">
      <div className="w-full min-h-screen pt-16 bg-gradient-dark">
        <div className={`${sizes[size]} mx-auto px-6 py-8 relative ${className}`}>
          {children}
        </div>
      </div>
      {/* Background extension for extra-wide viewports */}
      <div className="fixed inset-0 -z-10 bg-dark-900" />
    </div>
  );
}

export default Container; 
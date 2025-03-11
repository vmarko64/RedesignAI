import React from 'react';

/**
 * Reusable button component with different variants
 */
function Button({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary', 
  className = '',
  type = 'button',
  fullWidth = false,
  size = 'medium'
}) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-300 ease-in-out focus:outline-none';
  
  const sizeClasses = {
    small: 'py-1.5 px-3 text-sm',
    medium: 'py-2 px-4',
    large: 'py-3 px-6 text-lg'
  };
  
  const variantClasses = {
    primary: 'bg-gradient-button text-white hover:shadow-glow disabled:opacity-50',
    secondary: 'bg-dark-800/50 text-gray-100 border border-primary-500/20 hover:border-primary-500/40 hover:bg-dark-700/50',
    outline: 'border border-primary-500/20 text-gray-100 hover:border-primary-500/40 hover:bg-primary-500/10',
    ghost: 'text-gray-100 hover:bg-primary-500/10'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${widthClass}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button; 
import React from 'react';

function PromptInput({ 
  value, 
  onChange, 
  placeholder = "Enter additional instructions...",
  className = "",
  rows = 4,
  label = "",
  maxLength = 1000,
  required = false
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          className="block text-sm font-medium text-gray-300 mb-2"
          htmlFor="prompt-input"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <textarea
        id="prompt-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-dark-800 text-gray-100 placeholder-gray-500 border border-dark-600/20 
                 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 
                 focus:border-transparent shadow-inner-glow transition-all duration-300"
        rows={rows}
        maxLength={maxLength}
        required={required}
      />
      
      {maxLength > 0 && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500">
            {value.length} / {maxLength}
          </span>
        </div>
      )}
    </div>
  );
}

export default PromptInput; 
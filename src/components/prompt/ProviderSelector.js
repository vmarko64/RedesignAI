import React from 'react';

/**
 * Component for selecting AI provider (Gemini or Claude)
 */
function ProviderSelector({ 
  selectedProvider, 
  onSelect,
  label = "Select AI Provider",
  className = ""
}) {
  const providers = [
    { id: 'gemini', name: 'Gemini (Google)', description: 'Fast with good accuracy' },
    { id: 'claude', name: 'Claude (Anthropic)', description: 'Excellent at creative tasks' }
  ];
  
  return (
    <div className={`mb-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div className="flex space-x-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className={`flex-1 py-2 px-3 text-sm rounded transition-colors ${
              selectedProvider === provider.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onSelect(provider.id)}
          >
            {provider.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProviderSelector; 
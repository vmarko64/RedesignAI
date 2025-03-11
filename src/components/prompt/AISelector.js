import React from 'react';

function AISelector({ 
  models, 
  selectedModel, 
  onSelect,
  label = "Select AI Model",
  className = ""
}) {
  if (!models || models.length === 0) {
    return null;
  }
  
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <select
        value={selectedModel}
        onChange={(e) => onSelect(e.target.value)}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} {model.description ? `- ${model.description}` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AISelector; 
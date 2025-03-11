import React from 'react';
import { geminiModels } from '../../services/geminiService';
import { claudeModels } from '../../services/claudeService';
import { openaiModels } from '../../services/openaiService';

const AI_PROVIDERS = {
  openai: {
    name: 'ChatGPT',
    description: 'OpenAI\'s advanced language models',
    models: openaiModels
  },
  google: {
    name: 'Gemini',
    description: 'Google\'s advanced AI models',
    models: geminiModels
  },
  anthropic: {
    name: 'Claude',
    description: 'Anthropic\'s advanced AI assistant',
    models: claudeModels
  }
};

function AISelector({ selectedModel, onModelSelect, phase }) {
  const [selectedProvider, setSelectedProvider] = React.useState(null);

  const handleProviderSelect = (providerId) => {
    setSelectedProvider(providerId);
    // Clear model selection when changing provider
    onModelSelect(null);
  };

  return (
    <div className="space-y-6">
      {/* Provider Selection */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(AI_PROVIDERS).map(([providerId, provider]) => (
          <button
            key={providerId}
            onClick={() => handleProviderSelect(providerId)}
            className={`p-4 rounded-lg border transition-all duration-200
              ${selectedProvider === providerId
                ? 'bg-dark-800 border-primary-500 text-gray-100'
                : 'bg-dark-900 border-dark-700 text-gray-400 hover:bg-dark-800 hover:border-dark-500'
              }
            `}
          >
            <div className="text-center">
              <div className="font-medium text-lg">{provider.name}</div>
              <div className="text-sm text-gray-400 mt-1">{provider.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Model Selection */}
      {selectedProvider && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-300">
            Select {AI_PROVIDERS[selectedProvider].name} Model
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AI_PROVIDERS[selectedProvider].models.map((model) => (
              <button
                key={model.id}
                onClick={() => onModelSelect(model.id)}
                className={`p-4 rounded-lg border transition-all duration-200
                  ${selectedModel === model.id
                    ? 'bg-dark-800 border-primary-500 text-gray-100'
                    : 'bg-dark-900 border-dark-700 text-gray-400 hover:bg-dark-800 hover:border-dark-500'
                  }
                `}
              >
                <div className="text-left">
                  <div className="font-medium">{model.name}</div>
                  <div className="text-sm text-gray-400 mt-1">{model.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-400">
        {phase === 'analysis' ? (
          <p>First select an AI provider, then choose a model for analysis.</p>
        ) : (
          <p>First select an AI provider, then choose a model for generation.</p>
        )}
      </div>
    </div>
  );
}

export default AISelector; 
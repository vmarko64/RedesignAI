import React from 'react';
import Container from '../components/layout/Container';
import { useSettings } from '../contexts/SettingsContext';
import { ALL_MODELS } from '../config/modelConfig';

const API_SECTIONS = [
  {
    id: 'openai',
    title: 'OpenAI API Key',
    placeholder: 'sk-...',
    description: 'Required for ChatGPT models'
  },
  {
    id: 'google',
    title: 'Google API Key',
    placeholder: 'GOOGLE_API_KEY',
    description: 'Required for Gemini models'
  },
  {
    id: 'anthropic',
    title: 'Anthropic API Key',
    placeholder: 'sk-ant-...',
    description: 'Required for Claude models'
  }
];

function Settings() {
  const { settings, updateSettings } = useSettings();

  const handleChange = (section, key, value) => {
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    };
    updateSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-app pt-20 pb-12">
      <Container>
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold text-gray-100">Settings</h1>

          {/* API Keys Section */}
          <section className="card p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">API Keys</h2>
            <div className="space-y-6">
              {API_SECTIONS.map(section => (
                <div key={section.id} className="space-y-2">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-300">{section.title}</span>
                    <p className="text-xs text-gray-400 mb-2">{section.description}</p>
                    <input
                      type="password"
                      value={settings.apiKeys[section.id] || ''}
                      onChange={(e) => handleChange('apiKeys', section.id, e.target.value)}
                      className="input-field"
                      placeholder={section.placeholder}
                    />
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Default Models Section */}
          <section className="card p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">Default Models</h2>
            <div className="grid gap-6">
              <div>
                <label className="form-label">Default Analysis Model</label>
                <select
                  value={settings.preferences.defaultAnalysisModel}
                  onChange={(e) => handleChange('preferences', 'defaultAnalysisModel', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a default model</option>
                  {ALL_MODELS.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.providerName} - {model.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label">Default Generation Model</label>
                <select
                  value={settings.preferences.defaultGenerationModel}
                  onChange={(e) => handleChange('preferences', 'defaultGenerationModel', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a default model</option>
                  {ALL_MODELS.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.providerName} - {model.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="card p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="form-label mb-0">Save Generation History</label>
                  <p className="text-sm text-gray-400">Keep a record of your generated designs</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.preferences.saveHistory}
                  onChange={(e) => handleChange('preferences', 'saveHistory', e.target.checked)}
                  className="h-5 w-5 rounded border-dark-600 bg-dark-800 text-primary-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="form-label mb-0">Auto-Analyze Uploads</label>
                  <p className="text-sm text-gray-400">Automatically analyze new uploads</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.preferences.autoAnalyze}
                  onChange={(e) => handleChange('preferences', 'autoAnalyze', e.target.checked)}
                  className="h-5 w-5 rounded border-dark-600 bg-dark-800 text-primary-500"
                />
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}

export default Settings; 
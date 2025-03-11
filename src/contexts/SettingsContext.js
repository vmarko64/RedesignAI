import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  apiKeys: {
    openai: '',
    google: '',
    anthropic: ''
  },
  preferences: {
    saveHistory: true,
    autoAnalyze: false,
    defaultAnalysisModel: '',
    defaultGenerationModel: ''
  },
  defaultModels: {
    analysis: '',
    generation: ''
  }
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // Ensure all required fields exist by merging with defaults
      setSettings({
        ...DEFAULT_SETTINGS,
        ...parsed,
        // Ensure nested objects are properly merged
        apiKeys: { ...DEFAULT_SETTINGS.apiKeys, ...parsed.apiKeys },
        preferences: { ...DEFAULT_SETTINGS.preferences, ...parsed.preferences },
        defaultModels: { ...DEFAULT_SETTINGS.defaultModels, ...parsed.defaultModels }
      });
    }
  }, []);

  const updateSettings = (newSettings) => {
    // Ensure all required fields exist when updating
    const updatedSettings = {
      ...DEFAULT_SETTINGS,
      ...newSettings,
      // Ensure nested objects are properly merged
      apiKeys: { ...DEFAULT_SETTINGS.apiKeys, ...newSettings.apiKeys },
      preferences: { ...DEFAULT_SETTINGS.preferences, ...newSettings.preferences },
      defaultModels: { ...DEFAULT_SETTINGS.defaultModels, ...newSettings.defaultModels }
    };
    setSettings(updatedSettings);
    localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export default SettingsContext; 
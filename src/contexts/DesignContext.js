import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSettings } from './SettingsContext';
import { analyzeDesign as analyzeWithGemini, generateDesigns as generateWithGemini } from '../services/geminiService';
import { analyzeDesign as analyzeWithClaude, generateDesigns as generateWithClaude } from '../services/claudeService';

const DesignContext = createContext();

// Mapping of provider to service function
const analyzeServices = {
  'google': analyzeWithGemini,
  'anthropic': analyzeWithClaude,
  'openai': null // Add OpenAI service when implemented
};

const generateServices = {
  'google': generateWithGemini,
  'anthropic': generateWithClaude,
  'openai': null // Add OpenAI service when implemented
};

// Helper function to get provider from model ID
const getProviderFromModel = (modelId) => {
  if (!modelId) return null;
  
  const modelIdLower = modelId.toLowerCase();
  if (modelIdLower.includes('gemini')) return 'google';
  if (modelIdLower.includes('claude') || modelIdLower.includes('o1') || modelIdLower.includes('o3')) return 'anthropic';
  if (modelIdLower.includes('gpt')) return 'openai';
  return null;
};

export function DesignProvider({ children }) {
  const { settings } = useSettings();
  const [originalImage, setOriginalImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [generatedDesigns, setGeneratedDesigns] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  const [selectedModels, setSelectedModels] = useState({
    analysis: '',
    generation: ''
  });
  
  // Initialize selected models from settings
  useEffect(() => {
    if (settings?.defaultModels) {
      setSelectedModels({
        analysis: settings.defaultModels.analysis || '',
        generation: settings.defaultModels.generation || ''
      });
    }
  }, [settings]);
  
  const analyzeImage = async () => {
    if (!originalImage || !selectedModels.analysis) {
      setError('Please select an image and a model for analysis');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Get the provider based on the selected model
      const provider = getProviderFromModel(selectedModels.analysis);
      
      if (!provider) {
        throw new Error(`Invalid model selected: ${selectedModels.analysis}`);
      }
      
      // Get the API key for the selected provider
      const apiKey = settings.apiKeys[provider];
      
      if (!apiKey) {
        throw new Error(`Please set up your ${provider.toUpperCase()} API key in settings`);
      }
      
      console.log(`Analyzing image with model: ${selectedModels.analysis}, provider: ${provider}`);
      
      const reader = new FileReader();
      reader.readAsDataURL(originalImage);
      
      reader.onload = async () => {
        try {
          const imageData = reader.result.split(',')[1]; // Remove data URL prefix
          
          // Get the appropriate analysis service
          const analyzeService = analyzeServices[provider];
          
          if (!analyzeService) {
            throw new Error(`Analysis provider ${provider} not supported yet`);
          }
          
          const result = await analyzeService(
            imageData,
            selectedModels.analysis,
            apiKey
          );
          
          setAnalysisResult({
            ...result,
            provider: provider
          });
          
          console.log('Analysis complete:', result);
        } catch (error) {
          console.error('Error analyzing image:', error);
          setError(`Failed to analyze image: ${error.message}`);
        } finally {
          setIsAnalyzing(false);
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read the image file.');
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error('Error processing image:', error);
      setError(`Failed to process image: ${error.message}`);
      setIsAnalyzing(false);
    }
  };
  
  const generateDesignVariations = async () => {
    if (!analysisResult || !selectedModels.generation) {
      setError('Please complete analysis and select a generation model');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Get the provider based on the selected model
      const provider = getProviderFromModel(selectedModels.generation);
      
      if (!provider) {
        throw new Error(`Invalid model selected: ${selectedModels.generation}`);
      }
      
      // Get the API key for the selected provider
      const apiKey = settings.apiKeys[provider];
      
      if (!apiKey) {
        throw new Error(`Please set up your ${provider.toUpperCase()} API key in settings`);
      }
      
      console.log(`Generating designs with model: ${selectedModels.generation}, provider: ${provider}`);
      
      // Get the appropriate generation service
      const generateService = generateServices[provider];
      
      if (!generateService) {
        throw new Error(`Generation provider ${provider} not supported yet`);
      }
      
      const designs = await generateService(
        analysisResult,
        currentPrompt,
        3, // Number of designs to generate
        selectedModels.generation,
        apiKey
      );
      
      setGeneratedDesigns(designs);
    } catch (error) {
      console.error('Error generating designs:', error);
      setError(`Failed to generate designs: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const selectModel = (phase, modelId) => {
    setSelectedModels(prev => ({
      ...prev,
      [phase]: modelId
    }));
  };
  
  const resetSession = () => {
    setOriginalImage(null);
    setAnalysisResult(null);
    setGeneratedDesigns([]);
    setCurrentPrompt('');
    setError(null);
  };
  
  const value = {
    originalImage,
    analysisResult,
    generatedDesigns,
    currentPrompt,
    isAnalyzing,
    isGenerating,
    error,
    selectedModels,
    setOriginalImage,
    setCurrentPrompt,
    analyzeImage,
    generateDesigns: generateDesignVariations,
    resetSession,
    selectModel
  };

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}

export default DesignContext; 
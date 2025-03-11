import React from 'react';
import Container from '../components/layout/Container';
import AISelector from '../components/ai/AISelector';
import ImageUpload from '../components/upload/ImageUpload';
import PromptInput from '../components/prompt/PromptInput';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DesignViewer from '../components/designs/DesignViewer';
import { useDesign } from '../contexts/DesignContext';

function Home() {
  const { 
    originalImage, 
    setOriginalImage,
    analysisResult,
    currentPrompt, 
    setCurrentPrompt,
    error,
    isAnalyzing,
    isGenerating,
    selectedModels,
    selectModel,
    analyzeImage,
    generateDesigns,
    generatedDesigns
  } = useDesign();

  const handleAnalyze = async () => {
    if (!selectedModels.analysis) {
      alert('Please select an AI model for analysis');
      return;
    }
    await analyzeImage();
  };

  const handleGenerate = async () => {
    if (!selectedModels.generation) {
      alert('Please select an AI model for generation');
      return;
    }
    await generateDesigns();
  };

  return (
    <div className="min-h-screen bg-app">
      <Container className="pt-20 pb-12">
        <div className="space-y-8">
          {error && (
            <ErrorMessage 
              message={error} 
              onDismiss={() => {}} 
            />
          )}
          
          <section className="card p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Upload Design</h2>
            <ImageUpload onImageUpload={setOriginalImage} />
          </section>
          
          {originalImage && (
            <section className="card p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Select Analysis Model</h2>
              <AISelector
                selectedModel={selectedModels.analysis}
                onModelSelect={(modelId) => selectModel('analysis', modelId)}
                phase="analysis"
              />
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={!originalImage || isAnalyzing || !selectedModels.analysis}
                  className={`px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105
                    ${!selectedModels.analysis || isAnalyzing
                      ? 'bg-dark-600 text-dark-300 cursor-not-allowed'
                      : 'bg-primary-500 text-white shadow-lg hover:bg-primary-400 active:scale-95'
                    }
                  `}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner size="small" />
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    'Analyze Design'
                  )}
                </button>
              </div>
            </section>
          )}
          
          {analysisResult && (
            <section className="card p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Select Generation Model</h2>
              <AISelector
                selectedModel={selectedModels.generation}
                onModelSelect={(modelId) => selectModel('generation', modelId)}
                phase="generation"
              />
              <div className="mt-6">
                <PromptInput
                  value={currentPrompt}
                  onChange={setCurrentPrompt}
                  placeholder="Describe how you want to modify the design..."
                  label="Design Instructions"
                />
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleGenerate}
                  disabled={!originalImage || isGenerating || !selectedModels.generation}
                  className="w-full sm:w-auto"
                >
                  {isGenerating ? 'Generating...' : 'Generate Designs'}
                </Button>
              </div>
            </section>
          )}
          
          {(generatedDesigns.length > 0 || isGenerating) && (
            <section className="card p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Generated Designs</h2>
              {isGenerating ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner text="Generating designs..." />
                </div>
              ) : (
                <DesignViewer designs={generatedDesigns} />
              )}
            </section>
          )}
        </div>
      </Container>
    </div>
  );
}

export default Home; 
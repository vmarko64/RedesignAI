import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDesign } from '../contexts/DesignContext';
import Container from '../components/layout/Container';
import PromptInput from '../components/prompt/PromptInput';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';

function ExpandDesign() {
  const { designId } = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const { generatedDesigns, expandDesign, isGenerating, error } = useDesign();
  
  useEffect(() => {
    const foundDesign = generatedDesigns.find(d => d.id === designId);
    if (foundDesign) {
      setDesign(foundDesign);
    } else {
      // If design not found, redirect to home
      navigate('/');
    }
    setLoading(false);
  }, [designId, generatedDesigns, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!additionalPrompt.trim()) return;
    
    try {
      const expandedDesign = await expandDesign(designId, additionalPrompt);
      if (expandedDesign) {
        navigate(`/design/${expandedDesign.id}`);
      }
    } catch (err) {
      console.error('Error expanding design:', err);
    }
  };
  
  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner text="Loading design..." />
        </div>
      </Container>
    );
  }
  
  if (!design) {
    return (
      <Container>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Design not found</h2>
          <p className="text-gray-500">The design you're looking for doesn't exist or has been removed.</p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </div>
      
      <h1 className="text-2xl font-semibold mb-6">Expand on Design</h1>
      
      {error && <ErrorMessage message={error} />}
      
      <div className="mb-6 border rounded-lg overflow-hidden">
        <iframe
          title={`Design ${design.id}`}
          srcDoc={`
            <html>
              <head>
                <style>${design.cssContent}</style>
              </head>
              <body>${design.htmlContent}</body>
            </html>
          `}
          className="w-full h-64 border-0"
          sandbox="allow-same-origin"
        />
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Original Prompt</h2>
        <p className="bg-gray-100 p-3 rounded">
          {design.prompt || 'No prompt provided'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-2">Additional Directions</h2>
          <PromptInput
            value={additionalPrompt}
            onChange={setAdditionalPrompt}
            placeholder="Add more specific directions for how to expand this design..."
            rows={5}
            required
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            onClick={() => navigate(-1)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isGenerating || !additionalPrompt.trim()}
          >
            {isGenerating ? 'Generating...' : 'Expand Design'}
          </Button>
        </div>
      </form>
    </Container>
  );
}

export default ExpandDesign; 
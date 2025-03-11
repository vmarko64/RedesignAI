import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../common/Button';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useDesign } from '../../contexts/DesignContext';

function DesignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { generatedDesigns } = useDesign();
  
  const design = generatedDesigns.find(d => d.id === id);

  if (!design) {
    return (
      <div className="min-h-screen bg-dark-900 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-gray-100 mb-4">Design not found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleFavoriteToggle = () => {
    if (isFavorite(design.id)) {
      removeFavorite(design.id);
    } else {
      addFavorite(design);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleExpand = () => {
    navigate(`/expand/${design.id}`);
  };

  return (
    <div className="min-h-screen bg-dark-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={handleBack}
            variant="outline"
            size="small"
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </span>
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={handleFavoriteToggle}
              variant={isFavorite(design.id) ? "secondary" : "outline"}
              size="small"
            >
              {isFavorite(design.id) ? (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Saved
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Save
                </span>
              )}
            </Button>

            <Button
              onClick={handleExpand}
              variant="outline"
              size="small"
            >
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Improve
              </span>
            </Button>
          </div>
        </div>

        {/* Design Preview */}
        <div className="bg-dark-800 rounded-lg overflow-hidden shadow-xl">
          <div className="aspect-[16/9] relative">
            <iframe
              title={`Design ${design.id}`}
              srcDoc={`
                <html>
                  <head>
                    <style>${design.cssContent}</style>
                    <style>
                      body { margin: 0; height: 100vh; overflow: hidden; }
                    </style>
                  </head>
                  <body>${design.htmlContent}</body>
                </html>
              `}
              className="w-full h-full border-0"
              sandbox="allow-same-origin"
            />
          </div>
        </div>

        {/* Design Details */}
        {design.description && (
          <div className="mt-6 bg-dark-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-3">Design Description</h2>
            <p className="text-gray-300">{design.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DesignDetail; 
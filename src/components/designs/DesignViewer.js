import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../contexts/FavoritesContext';

function DesignViewer({ designs }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites || { 
    addFavorite: () => console.log('Add to favorites'),
    removeFavorite: () => console.log('Remove from favorites'),
    isFavorite: () => false
  };

  if (!designs || designs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No designs available. Generate some designs to see them here.
      </div>
    );
  }

  const currentDesign = designs[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? designs.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === designs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleFavoriteToggle = () => {
    if (isFavorite && isFavorite(currentDesign.id)) {
      removeFavorite(currentDesign.id);
    } else {
      addFavorite(currentDesign);
    }
  };

  const handleMaximize = () => {
    navigate(`/design/${currentDesign.id}`);
  };

  const handleImprove = () => {
    navigate(`/expand/${currentDesign.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Design Preview */}
      <div className="bg-dark-800 rounded-lg overflow-hidden shadow-lg">
        <div className="aspect-[16/9] relative">
          <iframe
            title={`Design ${currentIndex + 1}`}
            srcDoc={`
              <html>
                <head>
                  <style>${currentDesign.cssContent}</style>
                  <style>
                    body { margin: 0; height: 100vh; overflow: hidden; }
                  </style>
                </head>
                <body>${currentDesign.htmlContent}</body>
              </html>
            `}
            className="w-full h-full border-0"
            sandbox="allow-same-origin"
          />
        </div>
      </div>

      {/* Design Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevious}
            className="p-2 rounded-full bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
            aria-label="Previous design"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-gray-300">
            {currentIndex + 1} / {designs.length}
          </div>
          
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
            aria-label="Next design"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleFavoriteToggle}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors
              ${isFavorite && isFavorite(currentDesign.id)
                ? 'bg-primary-500 text-white'
                : 'bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-white'
              }
            `}
          >
            <svg className="w-5 h-5" fill={isFavorite && isFavorite(currentDesign.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{isFavorite && isFavorite(currentDesign.id) ? 'Saved' : 'Save'}</span>
          </button>
          
          <button
            onClick={handleImprove}
            className="px-4 py-2 rounded-lg bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-white flex items-center space-x-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Improve</span>
          </button>
          
          <button
            onClick={handleMaximize}
            className="px-4 py-2 rounded-lg bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-white flex items-center space-x-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
            <span>Maximize</span>
          </button>
        </div>
      </div>

      {/* Design Description */}
      {currentDesign.description && (
        <div className="bg-dark-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-200 mb-2">Description</h3>
          <p className="text-gray-300">{currentDesign.description}</p>
        </div>
      )}
    </div>
  );
}

export default DesignViewer; 
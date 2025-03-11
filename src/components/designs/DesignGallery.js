import React from 'react';
import { useDesign } from '../../contexts/DesignContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import DesignCard from './DesignCard';
import LoadingSpinner from '../common/LoadingSpinner';

function DesignGallery({ designs, isLoading, emptyMessage }) {
  const { generatedDesigns, isGenerating } = useDesign();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  // Use provided designs or fall back to generatedDesigns from context
  const displayDesigns = designs || generatedDesigns;
  const showLoading = isLoading !== undefined ? isLoading : isGenerating;
  
  const handleSaveToggle = (design) => {
    if (isFavorite(design.id)) {
      removeFavorite(design.id);
    } else {
      addFavorite(design);
    }
  };
  
  // Show loading spinner
  if (showLoading) {
    return (
      <div className="py-8 flex justify-center">
        <LoadingSpinner text="Generating designs..." />
      </div>
    );
  }
  
  // Show empty message
  if (!displayDesigns || displayDesigns.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          {emptyMessage || "No designs to display"}
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayDesigns.map(design => (
        <DesignCard
          key={design.id}
          design={design}
          onSave={handleSaveToggle}
          isSaved={isFavorite(design.id)}
        />
      ))}
    </div>
  );
}

export default DesignGallery; 
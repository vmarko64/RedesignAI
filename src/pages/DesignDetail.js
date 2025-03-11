import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDesign } from '../contexts/DesignContext';
import { useFavorites } from '../contexts/FavoritesContext';
import Container from '../components/layout/Container';
import DesignDetailComponent from '../components/designs/DesignDetail';
import LoadingSpinner from '../components/common/LoadingSpinner';

function DesignDetail() {
  const { designId } = useParams();
  const navigate = useNavigate();
  const { generatedDesigns } = useDesign();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Find design in generated designs or favorites
    let foundDesign = generatedDesigns.find(d => d.id === designId);
    
    if (!foundDesign) {
      foundDesign = favorites.find(d => d.id === designId);
    }
    
    if (foundDesign) {
      setDesign(foundDesign);
    } else {
      // If design not found, redirect to home page
      navigate('/');
    }
    
    setLoading(false);
  }, [designId, generatedDesigns, favorites, navigate]);
  
  const handleSaveToggle = (design) => {
    if (isFavorite(design.id)) {
      removeFavorite(design.id);
    } else {
      addFavorite(design);
    }
  };
  
  const handleExpand = (design) => {
    navigate(`/expand/${design.id}`);
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
      
      <h1 className="text-2xl font-semibold mb-4">Design Detail</h1>
      
      <DesignDetailComponent 
        design={design}
        onSave={handleSaveToggle}
        isSaved={isFavorite(design.id)}
        onExpand={handleExpand}
      />
    </Container>
  );
}

export default DesignDetail; 
import React from 'react';
import Container from '../components/layout/Container';
import DesignGallery from '../components/designs/DesignGallery';
import { useFavorites } from '../contexts/FavoritesContext';

function Favorites() {
  const { favorites } = useFavorites();
  
  return (
    <Container>
      <h1 className="text-2xl font-semibold mb-6">Favorites</h1>
      
      <DesignGallery 
        designs={favorites} 
        emptyMessage="You haven't saved any designs yet." 
      />
    </Container>
  );
}

export default Favorites; 
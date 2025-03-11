import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const [logoLoaded, setLogoLoaded] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Force reload the logo image
  useEffect(() => {
    // Create a new Image object to preload
    const img = new Image();
    img.src = `${process.env.PUBLIC_URL}/logoV2.png?v=${Date.now()}`; // Add cache-busting query param
    img.onload = () => setLogoLoaded(true);
    
    // Clear browser cache for the image
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
  }, []);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-header">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 group">
            <div className="flex items-center">
              {/* Significantly increased logo size */}
              <img 
                src="/assets/logoV2.png" 
                alt="RedesignAI Logo" 
                className="h-24" 
                style={{ 
                  filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))',
                  marginTop: '8px', /* Add some top margin to center vertically */
                  marginBottom: '8px'
                }}
                onError={(e) => {
                  console.error("Failed to load logo image");
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML += `
                    <span className="text-2xl font-bold text-white">Redesign</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">AI</span>
                  `;
                }}
              />
            </div>
          </Link>
          
          <nav className="flex items-center space-x-3">
            <Link 
              to="/" 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${isActive('/') 
                  ? 'bg-dark-800 text-white shadow-inner-lg' 
                  : 'text-gray-400 hover:bg-dark-800/50 hover:text-white'
                }`}
            >
              Home
            </Link>
            <Link 
              to="/favorites" 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${isActive('/favorites')
                  ? 'bg-dark-800 text-white shadow-inner-lg'
                  : 'text-gray-400 hover:bg-dark-800/50 hover:text-white'
                }`}
            >
              Favorites
            </Link>
            <Link 
              to="/settings" 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${isActive('/settings')
                  ? 'bg-dark-800 text-white shadow-inner-lg'
                  : 'text-gray-400 hover:bg-dark-800/50 hover:text-white'
                }`}
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header; 
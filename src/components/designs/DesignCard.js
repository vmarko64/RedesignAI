import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

function DesignCard({ 
  design, 
  onSave, 
  isSaved,
  className = "" 
}) {
  const navigate = useNavigate();
  
  if (!design) return null;
  
  const handleViewClick = () => {
    navigate(`/design/${design.id}`);
  };
  
  const handleExpandClick = (e) => {
    e.stopPropagation();
    navigate(`/expand/${design.id}`);
  };
  
  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (onSave) {
      onSave(design);
    }
  };
  
  return (
    <div className={`border rounded-lg overflow-hidden shadow-sm bg-white transition-shadow hover:shadow-md ${className}`}>
      <div 
        className="h-48 bg-gray-100 cursor-pointer relative" 
        onClick={handleViewClick}
      >
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
          className="w-full h-full border-0"
          sandbox="allow-same-origin"
        />
      </div>
      
      <div className="p-3">
        {design.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {design.description}
          </p>
        )}
        
        <div className="flex justify-between gap-2">
          <Button 
            onClick={handleExpandClick}
            variant="primary"
            size="small"
          >
            Expand
          </Button>
          
          <Button 
            onClick={handleSaveClick}
            variant={isSaved ? "secondary" : "outline"}
            size="small"
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DesignCard; 
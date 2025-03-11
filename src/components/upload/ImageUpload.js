import React, { useState, useRef } from 'react';

function ImageUpload({ onImageUpload, className = '' }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    processFile(file);
  };
  
  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      onImageUpload(file);
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className={`w-full ${className}`}>
      {!previewUrl ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <input 
            type="file" 
            id="image-upload" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            stroke="currentColor" 
            fill="none" 
            viewBox="0 0 48 48" 
            aria-hidden="true"
          >
            <path 
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
          
          <div className="mt-4">
            <label 
              htmlFor="image-upload" 
              className="cursor-pointer text-blue-500 hover:text-blue-700 font-medium"
            >
              Click to upload an image or drag and drop
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: PNG, JPG, JPEG, GIF, WEBP
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full max-h-64 object-contain" 
            />
            <button 
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
              title="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload; 
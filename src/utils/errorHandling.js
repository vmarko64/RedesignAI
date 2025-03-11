/**
 * Format error messages for API errors
 * @param {Error} error - The error object
 * @returns {string} Formatted error message
 */
export const formatApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data;
    
    if (status === 401 || status === 403) {
      return 'Authentication error. Please check your API key.';
    } else if (status === 429) {
      return 'Rate limit exceeded. Please try again later.';
    } else {
      return `API Error (${status}): ${message}`;
    }
  } else if (error.request) {
    // The request was made but no response was received
    return 'Network error. Please check your internet connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    return `Error: ${error.message}`;
  }
};

/**
 * Handle common API errors
 * @param {Error} error - The error object 
 * @param {Function} setError - Function to set error state
 */
export const handleApiError = (error, setError) => {
  console.error('API Error:', error);
  const errorMessage = formatApiError(error);
  setError(errorMessage);
}; 
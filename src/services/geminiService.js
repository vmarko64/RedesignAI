import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:3001/api';

export const geminiModels = [
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Fast workhorse model with real-time streaming'
  },
  {
    id: 'gemini-2-pro',
    name: 'Gemini 2.0 Pro',
    description: 'Strongest model for code and world knowledge'
  },
  {
    id: 'gemini-2-flash-lite',
    name: 'Gemini 2.0 Flash-Lite',
    description: 'Cost-effective option for high throughput'
  },
  {
    id: 'gemini-2-flash-thinking',
    name: 'Gemini 2.0 Flash Thinking',
    description: 'Experimental model with thinking process'
  }
];

/**
 * Check if the backend server is healthy
 * @returns {Promise<boolean>}
 */
async function checkServerHealth() {
  try {
    const healthCheck = await fetch(`${API_URL}/health`, { 
      method: 'GET',
      mode: 'cors'
    });
    if (!healthCheck.ok) {
      throw new Error('Backend server is not responding properly');
    }
    return true;
  } catch (healthError) {
    console.error('Health check failed:', healthError);
    throw new Error('Cannot connect to backend server. Is it running?');
  }
}

/**
 * Handle error responses from the server
 * @param {Response} response - The fetch response object
 * @returns {Promise<Object>} Parsed error data
 */
async function handleErrorResponse(response) {
  const errorText = await response.text();
  try {
    return JSON.parse(errorText);
  } catch (e) {
    return { error: errorText };
  }
}

/**
 * Analyze a website design image using Gemini
 * @param {string} imageData - Base64 encoded image data
 * @param {string} modelId - The Gemini model to use
 * @param {string} apiKey - The user's Gemini API key
 * @returns {Object} Analysis result
 */
export async function analyzeDesign(imageData, modelId, apiKey) {
  try {
    // Check server health before making the main request
    await checkServerHealth();

    console.log('Sending request to backend...'); // Debug log

    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'omit',
      signal: AbortSignal.timeout(60000), // 60 second timeout
      body: JSON.stringify({
        imageData,
        modelId,
        apiKey
      })
    });

    if (!response.ok) {
      const errorData = await handleErrorResponse(response);
      console.error('Backend error:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received response from backend');
    
    return {
      id: uuidv4(),
      description: data.candidates[0].content.parts[0].text,
      elements: extractElements(data.candidates[0].content.parts[0].text),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in analyzeDesign:', error);
    throw new Error(`Failed to analyze design: ${error.message}`);
  }
}

/**
 * Generate website design variations using Gemini
 * @param {Object} analysisResult - The analysis result
 * @param {string} prompt - Additional user instructions
 * @param {number} count - Number of designs to generate
 * @param {string} modelId - The Gemini model to use
 * @param {string} apiKey - The user's Gemini API key
 * @returns {Array} Array of generated designs
 */
export async function generateDesigns(analysisResult, prompt, count, modelId, apiKey) {
  try {
    // Check server health before making the main request
    await checkServerHealth();

    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'omit',
      signal: AbortSignal.timeout(60000), // 60 second timeout
      body: JSON.stringify({
        analysisResult: analysisResult.description,
        prompt,
        count,
        modelId,
        apiKey
      })
    });

    if (!response.ok) {
      const errorData = await handleErrorResponse(response);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const designs = [];

    try {
      const generatedText = data.candidates[0].content.parts[0].text;
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      const designData = JSON.parse(jsonMatch[0]);
      
      designs.push({
        id: uuidv4(),
        htmlContent: designData.html,
        cssContent: designData.css,
        description: designData.description,
        prompt: prompt,
        timestamp: new Date().toISOString()
      });
    } catch (parseError) {
      console.error('Error parsing design data:', parseError);
      throw new Error('Failed to parse generated design data');
    }
    
    return designs;
  } catch (error) {
    console.error('Error in generateDesigns:', error);
    throw new Error(`Failed to generate designs: ${error.message}`);
  }
}

function extractElements(analysisText) {
  const elements = [];
  const lines = analysisText.split('\n');
  
  for (const line of lines) {
    if (line.includes('header') || line.includes('navigation')) {
      elements.push({ type: 'header', description: line.trim() });
    } else if (line.includes('footer')) {
      elements.push({ type: 'footer', description: line.trim() });
    } else if (line.includes('section') || line.includes('container')) {
      elements.push({ type: 'section', description: line.trim() });
    }
  }
  
  return elements;
} 
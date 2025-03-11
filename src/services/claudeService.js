import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { formatApiError } from '../utils/errorHandling';

// The base URL for Claude API
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Analyze a website design image using Claude
 * @param {string} imageData - Base64 encoded image data
 * @param {string} modelId - The Claude model to use
 * @param {string} apiKey - The user's Claude API key
 * @returns {Object} Analysis result
 */
export async function analyzeDesign(imageData, modelId, apiKey) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2024-02-01'
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: "Analyze this website design in detail. Describe its layout, color scheme, and key elements. Focus on the visual hierarchy and user experience aspects."
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageData
              }
            }
          ]
        }],
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      id: uuidv4(),
      description: data.content[0].text,
      elements: extractElements(data.content[0].text),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in analyzeDesign:', error);
    throw new Error(`Failed to analyze design: ${error.message}`);
  }
}

/**
 * Generate website design variations based on analysis
 * @param {Object} analysisResult - The analysis result from Gemini
 * @param {string} prompt - Additional user instructions
 * @param {number} count - Number of designs to generate
 * @param {string} modelId - The Claude model to use
 * @param {string} apiKey - The user's Claude API key
 * @returns {Array} Array of generated designs
 */
export async function generateDesigns(analysisResult, prompt, count, modelId, apiKey) {
  try {
    const designs = [];
    for (let i = 0; i < count; i++) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2024-02-01'
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{
            role: 'user',
            content: `Based on this website design analysis:\n${analysisResult.description}\n\nGenerate a new website design with these modifications:\n${prompt}\n\nProvide the design as HTML and CSS code that maintains the core elements while incorporating the requested changes. The response should be in JSON format with html, css, and description fields.`
          }],
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.content[0].text;
      
      try {
        // Extract the JSON from the response
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
    }
    
    return designs;
  } catch (error) {
    console.error('Error in generateDesigns:', error);
    throw new Error(`Failed to generate designs: ${error.message}`);
  }
}

function extractElements(analysisText) {
  // Extract key elements from the analysis text
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

/**
 * Available Claude models
 */
export const claudeModels = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    description: 'Most intelligent Claude model with extended thinking'
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Advanced model excelling at coding'
  }
]; 
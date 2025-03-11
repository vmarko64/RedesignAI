const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Improved CORS configuration
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: false,
  maxAge: 86400 // Cache preflight requests for 24 hours
}));

// Increase payload limit for large images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v2';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { imageData, modelId, apiKey } = req.body;

    if (!imageData || !modelId || !apiKey) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log('Analyzing image with model:', modelId); // Debug log

    const response = await fetch(`${GEMINI_API_URL}/models/${modelId}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: "Analyze this website design in detail. Describe its layout, color scheme, and key elements. Focus on the visual hierarchy and user experience aspects."
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageData.split(',')[1]
              }
            }
          ]
        }],
        safety_settings: {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE"
        },
        generation_config: {
          temperature: 0.4,
          topP: 0.8,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini API error:', error); // Debug log
      throw new Error(error.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const { analysisResult, prompt, count, modelId, apiKey } = req.body;

    const response = await fetch(`${GEMINI_API_URL}/models/${modelId}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Based on this website design analysis:\n${analysisResult}\n\nGenerate a new website design with these modifications:\n${prompt}\n\nProvide the design as HTML and CSS code that maintains the core elements while incorporating the requested changes. The response should be in JSON format with html, css, and description fields.`
          }]
        }],
        safety_settings: {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE"
        },
        generation_config: {
          temperature: 0.4,
          topP: 0.8,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 
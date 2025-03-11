import { v4 as uuidv4 } from 'uuid';

export async function analyzeDesign(imageData, modelId, apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: "Analyze this website design in detail. Describe its layout, color scheme, and key elements. Focus on the visual hierarchy and user experience aspects."
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageData}`
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      id: uuidv4(),
      description: data.choices[0].message.content,
      elements: extractElements(data.choices[0].message.content),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in analyzeDesign:', error);
    throw new Error(`Failed to analyze design: ${error.message}`);
  }
}

export async function generateDesigns(analysisResult, prompt, count, modelId, apiKey) {
  try {
    const designs = [];
    for (let i = 0; i < count; i++) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            {
              role: 'user',
              content: `Based on this website design analysis:\n${analysisResult.description}\n\nGenerate a new website design with these modifications:\n${prompt}\n\nProvide the design as HTML and CSS code that maintains the core elements while incorporating the requested changes. The response should be in JSON format with html, css, and description fields.`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.choices[0].message.content;
      
      try {
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

export const openaiModels = [
  {
    id: 'gpt-4-5-preview',
    name: 'GPT-4.5 Preview',
    description: 'OpenAI\'s largest and most capable GPT model'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'A fast, intelligent, and flexible GPT model'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'A fast, affordable small model for focused tasks'
  },
  {
    id: 'o3-mini',
    name: 'O3-Mini',
    description: 'Fast, flexible reasoning model for STEM applications'
  },
  {
    id: 'o1',
    name: 'O1',
    description: 'High-intelligence reasoning model'
  },
  {
    id: 'o1-mini',
    name: 'O1-Mini',
    description: 'Faster, affordable reasoning model'
  }
]; 
export const AI_PROVIDERS = {
  openai: {
    name: 'ChatGPT',
    description: 'OpenAI\'s advanced language models',
    models: [
      {
        id: 'gpt-4-5-preview',
        name: 'GPT-4.5 Preview',
        description: 'OpenAI\'s largest and most capable GPT model'
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'Fast, intelligent, and flexible GPT model'
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: 'Fast, affordable small model for focused tasks'
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
    ]
  },
  gemini: {
    name: 'Gemini',
    description: 'Google\'s advanced AI models',
    models: [
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
    ]
  },
  claude: {
    name: 'Claude',
    description: 'Anthropic\'s advanced AI assistant',
    models: [
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
    ]
  }
};

export const ALL_MODELS = Object.entries(AI_PROVIDERS).flatMap(([provider, data]) =>
  data.models.map(model => ({
    ...model,
    provider: provider,
    providerName: data.name
  }))
); 
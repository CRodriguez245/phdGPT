const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// API route for chat (works for both Express and Vercel serverless)
app.post('/api/chat', async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured. Please set OPENAI_API_KEY in your .env file.' });
    }

    // Build conversation messages for ChatGPT API
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant for PhD researchers. Provide thoughtful, detailed, and well-structured responses to help with research questions, academic writing, and scholarly discussions.'
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('OpenAI API error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to get response from ChatGPT',
        details: errorData 
      });
    }

    const data = await response.json();
    
    // Extract the assistant's message
    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      return res.status(500).json({ error: 'No response from ChatGPT' });
    }

    // Return the response
    return res.status(200).json({
      message: assistantMessage,
      usage: data.usage
    });

  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server (only if not in Vercel serverless environment)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Make sure you have set OPENAI_API_KEY in your .env file');
  });
}

// Export for Vercel serverless
module.exports = app;


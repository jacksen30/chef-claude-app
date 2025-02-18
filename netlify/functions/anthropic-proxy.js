// netlify/functions/anthropic-proxy.js
require('dotenv').config();

exports.handler = async (event) => {
  // Add logs at the start to confirm the function *is* invoked
  console.log('=== Function anthropic-proxy invoked ===');
  console.log('EVENT:', event);

  try {
    console.log('Parsing event.body...');
    const body = JSON.parse(event.body || '{}');
    console.log('Parsed body:', body);

    // Check your env variable here
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('Missing ANTHROPIC_API_KEY environment variable');
    }

    console.log('Calling Claude API...');
    const response = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        prompt: body.prompt || 'Hello Claude!',
        model: 'claude-instant-v1',
        max_tokens_to_sample: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      // Log the error response text for debugging
      const errorText = await response.text();
      console.error('Claude API responded with an error:', errorText);

      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorText }),
      };
    }

    const data = await response.json();
    console.log('Claude response data:', data);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    // Always log the error so it shows in Netlify's function logs
    console.error('Caught error in Netlify function:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
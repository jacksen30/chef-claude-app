import fetch from 'node-fetch';

export async function handler(event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" })
        };
    }

    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing prompt" })
        };
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY, // Secure API key from Netlify env variables
            },
            body: JSON.stringify({
                prompt,
                model: "claude-3",  // Replace with the correct model
                max_tokens: 100  // Adjust based on needs
            })
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
        };
    }
}
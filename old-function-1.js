import fetch from 'node-fetch';

export async function handler(event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    const { ingredientsArr } = JSON.parse(event.body);

    if (!ingredientsArr || !Array.isArray(ingredientsArr)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid ingredients input" }),
        };
    }

    const SYSTEM_PROMPT = `
    You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients.
    The recipe can include additional ingredients, but try not to include too many extras.
    Format your response in markdown to make it easier to render on a webpage.
    `;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,  // 🔒 Securely stored in Netlify
            },
            body: JSON.stringify({
                model: "claude-3-haiku-20240307",
                max_tokens: 1024,
                system: SYSTEM_PROMPT,
                messages: [
                    { role: "user", content: `I have ${ingredientsArr.join(", ")}. Please give me a recipe!` },
                ],
            }),
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify({ recipe: data.content[0].text }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
        };
    }
}


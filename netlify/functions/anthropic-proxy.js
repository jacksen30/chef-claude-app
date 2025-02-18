import fetch from 'node-fetch';

export async function handler(event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    let ingredientsArr;
    try {
        const requestBody = JSON.parse(event.body || "{}");
        ingredientsArr = requestBody.ingredientsArr;

        if (!ingredientsArr || !Array.isArray(ingredientsArr)) {
            throw new Error("Invalid or missing 'ingredientsArr' in request.");
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid request body", details: error.message }),
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

        // ✅ Debugging: Log full API response in Netlify logs
        console.log("Anthropic API Response:", JSON.stringify(data, null, 2));

        // ✅ Check if `data.content` exists and is an array
        if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Unexpected API response format", fullResponse: data }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ recipe: data.content[0].text || "No recipe found." }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
        };
    }
}
export async function handler(event) {
    console.log("=== Anthropc-proxy function invoked ===");

    console.log("Event received:", {
      httpMethod: event.httpMethod,
      body: event.body,
    });

    // Check method
    if (event.httpMethod !== 'POST') {
      console.log("Method not allowed:", event.httpMethod);
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    // Parse request body
    let ingredientsArr;
    try {
      const parsedBody = JSON.parse(event.body);
      ingredientsArr = parsedBody.ingredientsArr;
      console.log("Parsed ingredientsArr:", ingredientsArr);
    } catch (parseError) {
      console.error("Error parsing JSON body:", parseError);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON body" }),
      };
    }

    // Validate ingredients array
    if (!ingredientsArr || !Array.isArray(ingredientsArr)) {
      console.error("Invalid ingredientsArr:", ingredientsArr);
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

    console.log("Checking ANTHROPIC_API_KEY presence...");
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("Missing ANTHROPIC_API_KEY environment variable!");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing API key" }),
      };
    }

    try {
      console.log("Making fetch request to Claude API...");
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY, // Securely stored in Netlify
          'anthropic-version': '2023-06-01',  // Keep updated to latest version
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Claude API error:", response.status, errorText);
        return {
          statusCode: response.status,
          body: JSON.stringify({ error: errorText }),
        };
      }

      const data = await response.json();
      console.log("Claude API response data:", data);

      // Just in case the shape of the data changes, handle safely:
      const recipeText = data?.content?.[0]?.text || "No recipe found.";
      console.log("Returning recipe:", recipeText);

      return {
        statusCode: 200,
        body: JSON.stringify({ recipe: recipeText }),
      };
    } catch (error) {
      console.error("Error during Claude API call:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
      };
    }
  }
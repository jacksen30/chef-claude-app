/* Fetches a recipe suggestion from the serverless function by sending a list of ingredients.
 * This function makes a POST request to the Netlify serverless function (`anthropic-proxy`),
 * passing an array of ingredients as the request body. The function then awaits the response,
 * extracts the recipe data, and returns it to the client.
 *
 * @param {string[]} ingredientsArr - An array of ingredients to generate a recipe.
 * @returns {Promise<string>} A promise that resolves to the generated recipe text.
 * Returns an error message if the request fails.
 */

export default async function getRecipeFromChefClaude(ingredientsArr) {
    try {
        const response = await fetch("/.netlify/functions/anthropic-proxy", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredientsArr }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.recipe;  // ✅ Extract recipe text
    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error("Error fetching recipe:", error);
        return "Sorry, something went wrong while generating the recipe.";
    }
}
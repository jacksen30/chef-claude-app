import { React, useState } from "react"

import IngredientsList from "./IngredientsList"
import ClaudeRecipe from "./ClaudeRecipe"

import getRecipeFromChefClaude from "../ai"

export default function Main() {
    const [ingredients, setIngredients] = useState([])

    const [recipe, setRecipe] = useState(false)

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients( prevIngredients => [...prevIngredients, newIngredient])
    }

    async function getRecipe() {
        const recipeMarkdown = await getRecipeFromChefClaude(ingredients)
        setRecipe(recipeMarkdown)
    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>
            {ingredients.length > 0 ? <IngredientsList ingredients={ingredients} getRecipe={getRecipe} /> : null }

            {recipe ? <ClaudeRecipe recipe={recipe} /> : null}
        </main>
    )
}


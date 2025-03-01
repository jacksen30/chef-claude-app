import { React, useState } from "react"

import IngredientsList from "./IngredientsList"
import ClaudeRecipe from "./ClaudeRecipe"

import getRecipeFromChefClaude from "../ai"

import LoadingAnimation from "./LoadingAnimation"

export default function Main() {
    const [ingredients, setIngredients] = useState([])

    const [recipe, setRecipe] = useState(false)

    const [recipeLoading, setRecipeLoading] = useState(false)

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients( prevIngredients => [...prevIngredients, newIngredient])
    }

    async function getRecipe() {
        setRecipeLoading(true)
        const recipeMarkdown = await getRecipeFromChefClaude(ingredients)
        setRecipe(recipeMarkdown)
        setRecipeLoading(false)
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

            {recipeLoading ? <LoadingAnimation /> : null}
            {recipe ? <ClaudeRecipe recipe={recipe} /> : null}
        </main>
    )
}


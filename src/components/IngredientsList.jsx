export default function IngredientsList(props) {

    const ingredientsListItems = props.ingredients.map(ingredient => (
        <li key={ingredient}>{ingredient}</li>
    ))
    return (
        <section>
                <h2>Ingredients on hand:</h2>
                <ul className="ingredients-list" aria-live="polite">{ingredientsListItems}</ul>
                {props.ingredients.length > 3 ?
                <div className="get-recipe-container">
                    <div>
                        {/* <h3>Ready for a recipe?</h3>
                        <p>Generate a recipe from your list of ingredients.</p> */}
                        <h3>Ready to generate a recipe from your list of ingredients?</h3>
                    </div>
                    <button onClick={props.getRecipe}>Create Recipe</button>
                </div> : null }
            </section>
    )
}
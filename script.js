document.getElementById('searchButton').addEventListener('click', async () => {
    const foodName = document.getElementById('foodInput').value.trim();
    const recipeResults = document.getElementById('recipeResults');

    if (!foodName) {
        recipeResults.innerHTML = '<div class="alert alert-warning">Please enter a food name.</div>';
        return;
    }

    recipeResults.innerHTML = '<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>';

    try {
        const response = await fetch(`php/fetch.php?ingredient=${encodeURIComponent(foodName)}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (data.error) {
            recipeResults.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
        } else if (data.hits.length === 0) {
            recipeResults.innerHTML = '<div class="alert alert-info">No recipes found.</div>';
        } else {
            recipeResults.innerHTML = data.hits.map(hit => {
                const { recipe } = hit;
                return `
                    <div class="recipe-item">
                        <img src="${recipe.image}" alt="${recipe.label}">
                        <div class="recipe-item-content">
                            <h5 class="recipe-item-title">${recipe.label}</h5>
                            <p class="recipe-item-text">Ingredients: ${recipe.ingredientLines.join(', ')}</p>
                            <a href="${recipe.url}" class="recipe-item-link" target="_blank" rel="noopener noreferrer">View Recipe</a>
                        </div>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        recipeResults.innerHTML = `<div class="alert alert-danger">An error occurred: ${error.message}. Please try again later.</div>`;
        console.error('Error fetching recipes:', error);
    }
});

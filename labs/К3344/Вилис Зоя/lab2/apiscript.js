const foodApi = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian";
// const params = {category: "Vegetarian"};

const container = document.querySelector('.gallery');

async function getItems (apiUrl) {
    try {
        const response = await fetch(apiUrl);

        if (response.status !== 200) {
            throw new Error(response.error)};
            
        const responseJson = await response.json();
        const meals = responseJson.meals;
        console.log(meals);
        
        meals.forEach((result) => {
            const card = document.createElement('div');
            card.classList = 'card-body';

            const content = `
                    <div class="card">
                        <img src="${result.strMealThumb}" class="card-img-top">
                        <div class="card-body">
                            <h4 class="card-title">${result.strMeal}</h4>
                            <p class="card-text">Click on this card to find the recipe for ${result.strMeal}.</p>
                            <p class="card-author">By <a href=profile.html>Venus</a></p>
                        </div>
                    </div>
            `;

            container.innerHTML += content;
            });

        console.log(responseJson);
        return responseJson;
    } catch (error) {
            console.error(`Caught error ${error}`)
    };
};

getItems(foodApi);





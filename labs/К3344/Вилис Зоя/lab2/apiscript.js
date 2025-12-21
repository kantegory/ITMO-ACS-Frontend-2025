const foodApi = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian";
// const params = {category: "Vegetarian"};
let extended = [];

const container = document.querySelector('.gallery');

async function getItems (apiUrl) {
    // try {
        const response = await fetch(apiUrl);

        // if (response.status !== 200) {
        //     throw new Error(response.error)};
            
        const responseJson = await response.json();
        console.log(responseJson);

        const meals = responseJson.meals;
        console.log(meals);

        for (let meal of meals) {
            const extResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
            const extResponseJson = await extResponse.json();
            const innerMeals = extResponseJson.meals;
            // console.log(innerMeals[0].strMeal);
            extended.push({
                recipe: innerMeals[0].strMeal,
                skill: innerMeals[0].strInstructions.length
            });

            const card = document.createElement('div');
            card.classList = 'card-body';

            const content = `
                    <div class="card">
                        <img src="${meal.strMealThumb}" class="card-img-top">
                        <div class="card-body">
                            <h4 class="card-title">${meal.strMeal}</h4>
                            <p class="card-text">Click on this card to find the recipe for ${meal.strMeal}.</p>
                            <p class="card-author">By <a href=profile.html>Venus</a></p>
                        </div>
                    </div>
            `;

            container.innerHTML += content;
        }
        
        // meals.forEach((result) => {
        //     // const extResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${result.idMeal}`)
        //     const card = document.createElement('div');
        //     card.classList = 'card-body';

        //     const content = `
        //             <div class="card">
        //                 <img src="${result.strMealThumb}" class="card-img-top">
        //                 <div class="card-body">
        //                     <h4 class="card-title">${result.strMeal}</h4>
        //                     <p class="card-text">Click on this card to find the recipe for ${result.strMeal}.</p>
        //                     <p class="card-author">By <a href=profile.html>Venus</a></p>
        //                 </div>
        //             </div>
        //     `;

        //     container.innerHTML += content;
        //     });

        console.log(extended);

        const extNumSorted = extended.toSorted((a, b) => a.skill - b.skill);

        const extAZSorted = extended.toSorted((a, b) => {
            const nameA = a.recipe;
            const nameB = b.recipe;
            return nameA.localeCompare(nameB);
        });

        const extZASorted = extended.toSorted((a, b) => {
            const nameA = a.recipe;
            const nameB = b.recipe;
            return nameB.localeCompare(nameA);
        });
        
        console.log(extNumSorted);
        console.log(extAZSorted);
        console.log(extZASorted);
        return responseJson;
    // } catch (error) {
    //         console.error(`Caught error ${error}`)
    // };
};



getItems(foodApi);

const sortAZ = function () {
    pass;
};

const sortZA = function () {
    pass;
};

const sortSkill = function () {
    pass;
};



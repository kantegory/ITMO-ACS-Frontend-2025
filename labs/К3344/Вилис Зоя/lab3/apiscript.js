const foodApi = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian";
// const params = {category: "Vegetarian"};
let extended = [];
// const cards = document.querySelectorAll('.card');

const container = document.querySelector('.gallery');

async function getItems (apiUrl) {
    try {
        const response = await fetch(apiUrl);

        if (response.status !== 200) {
            throw new Error(response.error)};
            
        const responseJson = await response.json();
        console.log(responseJson);

        const meals = responseJson.meals;
        // const meals1 = meals.slice(0, 10)
        console.log(meals);

        for (let meal of meals) {
            const extResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
            const extResponseJson = await extResponse.json();
            const innerMeals = extResponseJson.meals;
            // console.log(innerMeals[0].strMeal);
            extended.push({
                recipe: innerMeals[0].strMeal,
                skill: innerMeals[0].strInstructions.length,
                image: innerMeals[0].strMealThumb
            });
        };
        
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


        //     const card = document.createElement('div');
        //     card.classList = 'card-body';

        //     const content = `
        //             <div class="card">
        //                 <img src="${meal.strMealThumb}" class="card-img-top">
        //                 <div class="card-body">
        //                     <h4 class="card-title">${meal.strMeal}</h4>
        //                     <p class="card-text">Click on this card to find the recipe for ${meal.strMeal}.</p>
        //                     <p class="card-author">By <a href=profile.html>Venus</a></p>
        //                 </div>
        //             </div>
        //     `;

        //     container.innerHTML += content;
        // }
        
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
        const extAZSorted = extended.toSorted((a, b) => {
                const nameA = a.recipe;
                const nameB = b.recipe;
                return nameA.localeCompare(nameB);
            });
        console.log(extAZSorted);

        const extZASorted = extended.toSorted((a, b) => {
                const nameA = a.recipe;
                const nameB = b.recipe;
                return nameB.localeCompare(nameA);
            });
        console.log(extZASorted);
        
        const extNumSorted = extended.toSorted((a, b) => a.skill - b.skill);

        // let cards = Array.from(container.querySelectorAll('.card'));

        document.querySelector(".sortAZ").addEventListener("click", function () {
            container.innerHTML = '';
            extAZSorted.forEach((recipe) => {
                const newCard = document.createElement('div');
                newCard.classList = 'card-body';
                
                const content = `
                        <div class="card">
                            <img src="${recipe.image}" class="card-img-top">
                            <div class="card-body">
                                <h4 class="card-title">${recipe.recipe}</h4>
                                <p class="card-text">Click on this card to find the recipe for ${recipe.recipe}.</p>
                                <p class="card-author">By <a href=profile.html>Venus</a></p>
                            </div>
                        </div>
                `;

                container.innerHTML += content;
            })
        });

        document.querySelector(".sortZA").addEventListener("click", function () {
            container.innerHTML = '';
            extZASorted.forEach((recipe) => {
                const newCard = document.createElement('div');
                newCard.classList = 'card-body';

                const content = `
                        <div class="card">
                            <img src="${recipe.image}" class="card-img-top">
                            <div class="card-body">
                                <h4 class="card-title">${recipe.recipe}</h4>
                                <p class="card-text">Click on this card to find the recipe for ${recipe.recipe}.</p>
                                <p class="card-author">By <a href=profile.html>Venus</a></p>
                            </div>
                        </div>
                `;

                container.innerHTML += content;
            })
        });

        document.querySelector(".skill").addEventListener("click", function () {
            container.innerHTML = '';
            extNumSorted.forEach((recipe) => {
                const newCard = document.createElement('div');
                newCard.classList = 'card-body';
                
                const content = `
                        <div class="card">
                            <img src="${recipe.image}" class="card-img-top">
                            <div class="card-body">
                                <h4 class="card-title">${recipe.recipe}</h4>
                                <p class="card-text">Click on this card to find the recipe for ${recipe.recipe}.</p>
                                <p class="card-author">By <a href=profile.html>Venus</a></p>
                            </div>
                        </div>
                `;

                container.innerHTML += content;
            })
        });

        console.log(extended);
        return extended;
    } catch (error) {
            console.error(`Caught error ${error}`)
    };
};

getItems(foodApi);

// const sortAZ = function (foodApi) {
//     getItems(foodApi).then(extended => {
//         const extAZSorted = extended.toSorted((a, b) => {
//                 const nameA = a.recipe;
//                 const nameB = b.recipe;
//                 return nameA.localeCompare(nameB);
//             });
//         console.log(extAZSorted);
//         return extAZSorted;
//     });
// };

// const sortZA = function () {
//     getItems(foodApi).then(extended => {
//         const extZASorted = extended.toSorted((a, b) => {
//                 const nameA = a.recipe;
//                 const nameB = b.recipe;
//                 return nameB.localeCompare(nameA);
//             });
//         console.log(extZASorted);
//         return extZASorted;
//     });
// };


// const sortSkill = function () {
//     getItems(foodApi).then(extended => {
//         const extNumSorted = extended.toSorted((a, b) => a.skill - b.skill);
//         return extNumSorted;
//     });
//     console.log(extNumSorted);
//     return extNumSorted;
// };

// // sortAZ(foodApi);
// console.log(sortAZ(foodApi))

// console.log(extAZSorted);
// console.log(extZASorted);

// document.querySelector(".sortZA").addEventListener("click", function () {
//     getItems(foodApi).then(extended => {
//         let cards = Array.from(container.querySelectorAll('.card'));
//         const extZASorted = extended.toSorted((a, b) => {
//                 const nameA = a.recipe;
//                 const nameB = b.recipe;
//                 return nameB.localeCompare(nameA);
//             });
//         console.log(extZASorted);
//         return extZASorted;
//     });
//     cards.forEach((card) => {
//         container.appendChild(card);
//     });
// })
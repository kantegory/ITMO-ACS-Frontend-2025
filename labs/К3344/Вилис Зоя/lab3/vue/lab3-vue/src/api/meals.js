class MealsApi {
 constructor(instance) {
   this.API = instance
 }


 getItems = async () => {
   return this.API({
     url: "https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian"
   })
 }


 getItemsDetails = async (data) => {
   const meals = data;
   const extended = [];
   for (let meal of meals) {
    const extResponse = await this.API({
        method: 'GET',
        url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`,
        headers: {
        'Content-Type': 'application/json'
        }
    });
    const innerMeals = extResponse.data.meals;  // Assuming Axios response
        extended.push({
          recipe: innerMeals[0].strMeal,
          skill: innerMeals[0].strInstructions.length,
          image: innerMeals[0].strMealThumb
        });
   }
   return extended;
 }
}

export default MealsApi
//     const response = await this.getAll();
//     const meals = response.data.meals;

//     for (let meal of meals) {
//         const extResponse = await this.API({
//           url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
//         });
//         const innerMeals = extResponse.data.meals;
//         extended.push({
//           recipe: innerMeals[0].strMeal,
//           skill: innerMeals[0].strInstructions.length,
//           image: innerMeals[0].strMealThumb
//         });
//       }
//  }
// }



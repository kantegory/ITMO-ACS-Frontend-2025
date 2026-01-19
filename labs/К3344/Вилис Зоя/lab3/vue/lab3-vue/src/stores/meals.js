import { defineStore } from 'pinia'
// импортируем API
import { mealsApi } from '@/api'


// создаём хранилище
const useMealsStore = defineStore('meals', {
 // в стейте заведём пустой массив с заемтками
 state: () => ({
   meals: []
 }),


 actions: {
   // заведём метод для подгрузки заметок
   async loadMeals() {
     const response = await mealsApi.getItems();


     this.meals = response.data;


     return response;
   },


   // и метод для создания новой заметки
   async loadMealsExtended(data) {
     const response = await mealsApi.getItemsDetails(data);


     this.meals = response;


     return response;
   }
 }
})


export default useMealsStore
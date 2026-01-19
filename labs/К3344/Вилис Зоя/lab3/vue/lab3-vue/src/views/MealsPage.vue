<template>
 <base-layout>
    <div class="parameters">
        <div class="latestbox">
            <h3 class="latest">Recipes</h3>
        </div>
        <div class="btn-group">
            <button class="btn btn-lg dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Sort by</button>
            <ul class="dropdown-menu">
                <li><button class="dropdown-button sortAZ">A-Z</button></li>
                <li><button class="dropdown-button sortZA">Z-A</button></li>
                <li><button class="dropdown-button skill">Skill level</button></li>
            </ul>
        </div>
    </div>
    <hr />
    <div class="card" v-for="meal in meals" :key="meal.strMeal">
        <meal-card :thumbnail="meal.image" :meal="meal.recipe" />
    </div>
 </base-layout>
</template>


<script>
import BaseLayout from '@/layouts/BaseLayout.vue'
import MealCard from '@/components/MealCard.vue'
import { mapActions, mapState } from 'pinia'
import useMealsStore from '@/stores/meals'


export default {
 name: 'MealsPage',


 components: { BaseLayout, MealCard },
//  data() {
//    return {
//      form: {
//        name: '',
//        text: '',
//        userId: 1
//      }
//    }
//  },

 computed: {
   ...mapState(useMealsStore, ['meals'])
 },


 methods: {
   ...mapActions(useMealsStore, ['loadMeals', 'loadMealsExtended'])
},

 async mounted() {
    try {
      await this.loadMeals();  
      await this.loadMealsExtended(this.meals);  
    } catch (error) {
      console.error('Error loading meals:', error);
    }
 }
}
</script>
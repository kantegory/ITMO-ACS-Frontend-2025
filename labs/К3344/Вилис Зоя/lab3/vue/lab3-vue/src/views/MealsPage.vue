<template>
    <Header />
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
 <base-layout>
    <!-- <div class="heading">
        <button class="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#2a3c31"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 6H20M4 12H20M4 18H20" stroke="#2a3c31" stroke-width="2.04" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </button>
        <div class="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasTopLabel">Menu</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <a href="recipes.html">Recipes</a> 
                <a href="">Blog</a>
                <a href="profile.html">Profile</a>
                <a href="login.html">Log In</a>
            </div>
        </div>
        <h1 class="heading-title"><a href="index.html">Venus' Vegetarian Ward</a></h1>     
    </div> -->
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
import Header from '@/components/Header.vue'



export default {
 name: 'MealsPage',


 components: { BaseLayout, MealCard, Header },
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
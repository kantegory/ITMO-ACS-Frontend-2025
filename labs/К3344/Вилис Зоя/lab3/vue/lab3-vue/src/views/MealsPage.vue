<template>
 <base-layout>
    <div class="parameters">
        <div class="latestbox">
            <h3 class="latest">Recipes</h3>
        </div>
        <div class="btn-group">
            <button class="btn btn-lg dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Sort by</button>
            <ul class="dropdown-menu">
                <!-- <li><button class="dropdown-button">Rating</button></li> -->
                <li><button class="dropdown-button sortAZ">A-Z</button></li>
                <li><button class="dropdown-button sortZA">Z-A</button></li>
                <li><button class="dropdown-button skill">Skill level</button></li>
                <!-- <li><button class="dropdown-button">Date added: newest</button></li>
                <li><button class="dropdown-button">Date added: oldest</button></li> -->
            </ul>
        </div>
    </div>
    <hr />
 </base-layout>
</template>


<script>
import BaseLayout from '@/layouts/BaseLayout.vue'
import MealCard from '@/components/MealCard.vue'


export default {
 name: 'MealsPage',


 components: { BaseLayout, MealCard }
}
</script>
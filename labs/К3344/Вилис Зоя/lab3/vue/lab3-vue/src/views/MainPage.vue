<template>
    <Header />
    <div class="home-outer">
            <h3 class="latest">Latest recipes</h3>
            <div class="home-inner">
                <div class="card">
                    <img src="images/lasagna.jpg" class="card-img-top" alt="lasagna">
                    <div class="card-body">
                        <h4 class="card-title">Pumpkin Lasagna</h4>
                        <p class="card-text">Click on this card to find the recipe for Pumpkin Lasagna.</p>
                        <p class="card-author">By <a href=profile.html>Venus</a></p>
                    </div>
                </div>
                <div class="card">
                    <img src="images/dal.jpg" class="card-img-top" alt="dal">
                    <div class="card-body">
                        <h4 class="card-title">Vegan Dal</h4>
                        <p class="card-text">Click on this card to find the recipe for Vegan Dal.</p>
                        <p class="card-author">By <a href=profile.html>Venus</a></p>
                    </div>
                </div>
                <div class="card">
                    <img src="images/crispytofu.jpg" class="card-img-top" alt="tofu">
                    <div class="card-body">
                        <h4 class="card-title">Crispy Tofu Stir Fry</h4>
                        <p class="card-text">Click on this card to find the recipe for Crispy Tofu Stir Fry.</p>
                        <p class="card-author">By <a href=profile.html>Venus</a></p>
                    </div>
                </div>
                <div class="card">
                    <img src="images/tiramisu.jpg" class="card-img-top" alt="tiramisu">
                    <div class="card-body">
                        <h4 class="card-title">Vegan Tiramisu</h4>
                        <p class="card-text">Click on this card to find the recipe for Vegan Tiramisu.</p>
                        <p class="card-author">By <a href=profile.html>Venus</a></p>
                    </div>
                </div>
            </div>
        </div>
    <base-layout>
    <meal-card :thumbnail="src/assets/images/lasagna.jpg" :meal="meal.recipe" />
    </base-layout>
</template>

<script>
    import BaseLayout from '@/layouts/BaseLayout.vue'
    import Header from '@/components/Header.vue'
    export default {
        name: 'ProfilePage',


        components: { BaseLayout, Header }
    }
</script>
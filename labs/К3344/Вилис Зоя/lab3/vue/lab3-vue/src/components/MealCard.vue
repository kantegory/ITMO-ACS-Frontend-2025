<template>
    <div class="card">
        <img :src="thumbnail" class="card-img-top">
        <div class="card-body">
            <h4 class="card-title">{{ meal }}</h4>
            <p class="card-text">Click on this card to find the recipe for {{ meal }}.</p>
            <p class="card-author">By Venus</p>
        </div>
    </div>
</template>

<script>
export default {
 name: 'MealCard',
 // свойства, которые принимает компонент
 props: {
   thumbnail: {
     type: String,
     required: true
   },
   meal: {
     type: String,
     required: true
   }
 }
}
</script>
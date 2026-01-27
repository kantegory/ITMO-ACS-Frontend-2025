<template>
  <div class="card">
    <img :src="img" class="card-img-top">
    <div class="card-body">
      <h5>{{ title }}</h5>
      <p>{{ price }} ₽/мес</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    price: Number,
    img: String
  }
}
</script>

<script>
export default {
  name: "MenuItem",
  props: {
    dishName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
};
</script>

<template>
  <div class="col">
    <div class="card-bg card">
      <img
        src="https://zefirka.club/uploads/posts/2023-01/1673355119_22-zefirka-club-p-znak-voprosa-na-chernom-fone-46.jpg"
        class="menu-card-image card-img-top"
        :alt="dishName"
      />
      <div class="card-bg card-body">
        <h2 class="restaurant-card-title card-title">{{ dishName }}</h2>
        <p class="card-text">{{ description }}</p>
        <p class="card-text">
          <small>{{ price }} рублей</small>
        </p>
      </div>
    </div>
  </div>
</template>

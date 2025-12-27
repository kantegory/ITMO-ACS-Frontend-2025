<script>
export default {
  name: "RestaurantCard",
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    cuisines: {
      type: Array,
      required: true,
      default: [],
    },
    priceFrom: {
      type: Number,
      required: true,
    },
  },
  data() {
    let cuisinesString = this.cuisines.join(", ");
    if (cuisinesString.length > 15) {
      cuisinesString = cuisinesString.substring(0, 15) + "...";
    }

    return {
      cuisinesString,
    };
  },
};
</script>

<template>
  <div class="col">
    <div class="card-bg card">
      <img
        src="https://zefirka.club/uploads/posts/2023-01/1673355119_22-zefirka-club-p-znak-voprosa-na-chernom-fone-46.jpg"
        ,
        class="restaurant-image card-img-top"
        alt="{{ name }}"
      />
      <div class="card-body">
        <h3 class="restaurant-card-title card-title">{{ name }}</h3>
        <p class="card-text">{{ description }}</p>
        <ul class="list-group list-group-flush mb-3">
          <li class="card-bg list-group-item">Город: {{ city }}</li>
          <li class="card-bg list-group-item">Кухня: {{ cuisinesString }}</li>
          <li class="card-bg list-group-item">Цена: От {{ priceFrom }} рублей</li>
        </ul>
        <a href="restaurant-detail.html?id=${id}&name=${name}" class="btn btn-primary text-white"
          >Подробнее</a
        >
      </div>
    </div>
  </div>
</template>

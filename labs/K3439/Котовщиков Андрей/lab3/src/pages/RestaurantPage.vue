<script>
import CommentList from "@/components/CommentList.vue";
import MenuItem from "@/components/MenuItem.vue";
import Navbar from "@/components/Navbar.vue";
import useRestaurantsStore from "@/stores/restaurants";
import { mapActions, mapState } from "pinia";

export default {
  name: "RestaurantDetailPage",

  components: { Navbar, MenuItem, CommentList },

  computed: {
    ...mapState(useRestaurantsStore, ["menus"]),
  },

  methods: {
    ...mapActions(useRestaurantsStore, ["fetchMenus"]),
  },

  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },

  mounted() {
    this.fetchMenus({ restaurantId: this.id });
  },
};
</script>

<template>
  <navbar />
  <div class="container mb-5">
    <h1 class="restaurant-name text-center mb-4">{{ name }}</h1>
    <div id="photos" class="carousel slide">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img
            src="https://avatars.mds.yandex.net/get-altay/5104371/2a000001824f70aaf9918cd1c86c20b9ed81/orig"
            class="restaurant-slider-image d-block w-100"
            alt="..."
          />
        </div>
        <div class="carousel-item">
          <img
            src="https://avatars.mds.yandex.net/get-altay/5104371/2a000001824f70aaf9918cd1c86c20b9ed81/orig"
            class="restaurant-slider-image d-block w-100"
            alt="..."
          />
        </div>
      </div>

      <button
        class="carousel-control-prev"
        type="button"
        aria-label="Предыдущая картинка"
        data-bs-target="#photos"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>

      <button
        class="carousel-control-next"
        type="button"
        aria-label="Следующая картинка"
        data-bs-target="#photos"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>
  </div>

  <div class="container mb-5">
    <h2 class="section-title mb-4">Меню</h2>
    <div class="menu-cards row row-cols-3 g-3">
      <div v-for="menu in menus[id]">
        <menu-item :dish-name="menu.dishName" :description="menu.description" :price="menu.price" />
      </div>
    </div>
  </div>

  <comment-list />
</template>

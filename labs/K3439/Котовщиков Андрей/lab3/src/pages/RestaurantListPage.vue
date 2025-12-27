<script>
import { mapActions, mapState } from "pinia";
import useRestaurantsStore from "@/stores/restaurants";
import RestaurantCard from "@/components/RestaurantCard.vue";
import Spinner from "@/components/Spinner.vue";
import SvgSprite from "@/components/SvgSprite.vue";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "RestaurantListPage",

  components: { Navbar, RestaurantCard, Spinner, SvgSprite },

  computed: {
    ...mapState(useRestaurantsStore, ["restaurants"]),
  },

  methods: {
    ...mapActions(useRestaurantsStore, ["fetchRestaurants"]),

    async onFilterRestaurants() {
      console.log(this.filters);
      this.isLoading = true;
      try {
        await this.fetchRestaurants(this.filters);
      } catch (err) {
        alert(err);
      }

      this.isLoading = false;
    },

    async onResetFilter() {
      this.isLoading = true;
      try {
        this.filters = { city: null, cuisines: null, priceFrom: null };
        await this.fetchRestaurants(this.filters);
      } catch (err) {
        alert(err);
      }

      this.isLoading = false;
    },
  },

  async mounted() {
    if (this.restaurants.length !== 0) {
      return;
    }

    this.isLoading = true;
    try {
      await this.fetchRestaurants({});
    } catch (err) {
      alert(err);
    }

    this.isLoading = false;
  },

  data() {
    return {
      isLoading: false,
      filters: {
        city: null,
        cuisines: null,
        priceFrom: null,
      },
    };
  },
};
</script>

<template>
  <svg-sprite />
  <navbar />

  <div class="container">
    <div class="d-flex mb-4 align-items-center">
      <h1 class="me-2">Список ресторанов</h1>
      <svg class="logo">
        <use href="#logo"></use>
      </svg>
    </div>

    <div class="card-bg card mb-5">
      <div class="card-body">
        <div class="d-flex align-items-center mb-2">
          <h2 class="card-title me-2">Фильтры</h2>
          <svg class="filter-icon">
            <use href="#filter-icon"></use>
          </svg>
        </div>
        <div class="row g-3">
          <div class="col-md-4">
            <div class="d-flex align-items-center mb-2">
              <svg class="cuisine-icon me-1">
                <use href="#cuisine-icon"></use>
              </svg>
              <label class="form-label" for="cuisine-filter" style="margin: 0px">Кухня</label>
            </div>
            <select
              v-model="filters.cuisines"
              id="cuisine-filter"
              class="card-bg cuisine-filter form-select"
            >
              <option :value="null">Любая</option>
              <option value="Итальянская">Итальянская</option>
              <option value="Японская">Японская</option>
              <option value="Русская">Русская</option>
              <option value="Грузинская">Грузинская</option>
              <option value="Французская">Французская</option>
              <option value="Американская">Американская</option>
            </select>
          </div>

          <div class="col-md-4">
            <div class="d-flex align-items-center mb-2">
              <svg class="city-icon me-1">
                <use href="#city-icon"></use>
              </svg>
              <label class="form-label" for="city-filter" style="margin: 0px">Город</label>
            </div>
            <select v-model="filters.city" id="city-filter" class="card-bg city-filter form-select">
              <option :value="null">Любой</option>
              <option value="Санкт-Петербург">Санкт-Петербург</option>
              <option value="Москва">Москва</option>
              <option value="Екатеринбург">Екатеринбург</option>
            </select>
          </div>

          <div class="col-md-4">
            <div class="d-flex align-items-center mb-2">
              <svg class="price-icon me-1">
                <use href="#price-icon"></use>
              </svg>
              <label class="form-label" for="price-filter" style="margin: 0px">Цена</label>
            </div>
            <select
              v-model="filters.priceFrom"
              id="price-filter"
              class="card-bg price-filter form-select"
            >
              <option :value="null">Не имеет значения</option>
              <option value="500">От 500 рублей</option>
              <option value="1000">От 1000 рублей</option>
              <option value="2000">От 2000 рублей</option>
            </select>
          </div>

          <div class="col-12">
            <button @click.prevent="onFilterRestaurants" class="filter-btn btn btn-primary me-2">
              Применить
            </button>
            <button @click.prevent="onResetFilter" class="reset-filter-btn btn btn-danger">
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </div>

    <h2 class="mb-4">Доступные рестораны</h2>
    <spinner v-if="isLoading" />
    <div class="card-list row row-cols-4 g-4 mb-5">
      <div v-for="restaurant in restaurants" :key="restaurant.id">
        <restaurant-card :id="restaurant.id" :name="restaurant.name" :city="restaurant.city"
        :cuisines="restaurant.cuisines" :description="restaurant.description"
        :price-from="restaurant.priceFrom"" />
      </div>
    </div>
  </div>
</template>

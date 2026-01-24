<template>
  <div>
    <div class="container mt-4">
      <div class="row g-4">
        <div class="col-md-6 col-lg-4" v-for="prop in properties" :key="prop.id">
          <div class="card h-100 shadow-sm">
            <img :src="prop.image" class="card-img-top" style="height:200px;object-fit:cover;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ prop.name }}</h5>
              <p class="card-text text-muted small">{{ prop.address }}</p>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge bg-success">₽ {{ prop.price }} / мес</span>
                <span class="text-muted small">⭐ {{ prop.rating }}</span>
              </div>
              <ul class="list-unstyled small mb-3">
                <li><i class="fas fa-bed me-1"></i> {{ prop.rooms }} спальни</li>
                <li><i class="fas fa-bath me-1"></i> {{ prop.bathrooms }} ванная</li>
                <li><i class="fas fa-ruler-combined me-1"></i> {{ prop.area }} м²</li>
              </ul>
              <router-link :to="`/property/${prop.id}`" class="btn btn-outline-danger mt-auto">
                Подробнее
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import axios from "axios";

export default {
  components: { Navbar, Footer },
  data() {
    return {
      properties: []
    };
  },
  async mounted() {
    try {
      const res = await axios.get("http://localhost:8001/properties/");
      this.properties = res.data;
    } catch (err) {
      console.error(err);
      alert("Не удалось загрузить объекты недвижимости");
    }
  }
};
</script>

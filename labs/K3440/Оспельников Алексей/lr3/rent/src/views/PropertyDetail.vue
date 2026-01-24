<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";

const route = useRoute();
const property = ref(null);
const propertyId = route.params.id;

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8001/properties/${propertyId}`);
    property.value = res.data;
  } catch (err) {
    console.error(err);
    alert("Не удалось загрузить объект недвижимости");
  }
});

function openContactModal() {
  alert("Открыть модальное окно связи с арендодателем");
}

function openBookingModal() {
  alert("Открыть модальное окно бронирования");
}
</script>

<template>
  <div>
    <div class="container mt-4" v-if="property">
      <div class="row">
        <div class="col-md-8">
          <div class="card shadow-sm mb-4">
            <img :src="property.image" class="card-img-top" style="height:400px; object-fit:cover;" />
            <div class="card-body">
              <h1 class="card-title">{{ property.name }}</h1>
              <p class="text-muted">{{ property.address }}</p>
              <div class="d-flex justify-content-between align-items-center mb-4">
                <span class="badge bg-success fs-5">₽ {{ property.price }} / мес</span>
                <span class="text-muted">⭐ {{ property.rating }}</span>
              </div>
              <h5>Описание</h5>
              <p>Уютная {{ property.rooms }}-комнатная {{ property.type.toLowerCase() }} площадью {{ property.area }} м².</p>
              <h5>Характеристики</h5>
              <ul>
                <li>Комнат: {{ property.rooms }}</li>
                <li>Ванных: {{ property.bathrooms }}</li>
                <li>Тип: {{ property.type }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <h5>Действия</h5>
              <button class="btn btn-primary w-100 mb-3" @click="openContactModal">
                <i class="fas fa-envelope me-1"></i> Написать арендодателю
              </button>
              <button class="btn btn-outline-danger w-100 mb-3" @click="openBookingModal">
                <i class="fas fa-calendar-check me-1"></i> Забронировать
              </button>
              <div class="text-center">
                <img src="https://via.placeholder.com/80" class="rounded-circle mb-2" alt="Арендодатель">
                <p class="mb-0">Иван Иванов</p>
                <small class="text-muted">Арендодатель с 2023 года</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

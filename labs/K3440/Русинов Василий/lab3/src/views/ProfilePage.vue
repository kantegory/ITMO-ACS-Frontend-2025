<script setup>
import { onMounted, ref } from "vue";
import { http } from "@/api/instance";
import { useRentals } from "@/composables/useRentals";

const user = ref({});
const rentals = ref([]);

const { getUserRentals } = useRentals();

onMounted(async () => {
  const userId = localStorage.getItem("userId");

  user.value = (await http.get(`/users/${userId}`)).data;
  rentals.value = await getUserRentals(userId);
});
</script>

<template>
  <div class="container mt-4">
    <h1>Личный кабинет</h1>

    <div class="card p-3 mt-3">
      <p>Имя: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>
    </div>

    <h2 class="mt-4">Арендованные объекты</h2>

    <div class="row g-3">
      <div v-for="item in rentals" :key="item.id" class="col-md-4">
        <div class="card">
          <img :src="item.img" class="card-img-top" />
          <div class="card-body">
            <h5>{{ item.title }}</h5>
            <p>{{ item.price }} ₽/мес</p>
          </div>
        </div>
      </div>

      <p v-if="rentals.length === 0">
        У вас пока нет арендованных объектов
      </p>
    </div>
  </div>
</template>

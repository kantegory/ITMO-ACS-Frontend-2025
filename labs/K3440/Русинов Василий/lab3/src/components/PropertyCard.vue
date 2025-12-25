<script setup>
import { useRentals } from "@/composables/useRentals";

defineProps({
  item: Object
});

const { rent } = useRentals();
</script>

<template>
  <div class="col-md-4">
    <div class="card">
      <img :src="item.img" class="card-img-top" />
      <div class="card-body">
        <h5>{{ item.title }}</h5>
        <p>{{ item.price }} ₽/мес</p>

        <button
          class="btn btn-success w-100"
          @click="rent(item)"
        >
          Арендовать
        </button>
      </div>
    </div>
  </div>
</template>

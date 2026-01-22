<script>
export default {
  name: "BookingCard",

  props: {
    restaurantName: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      dateObj: new Date(this.date),
    };
  },
};
</script>

<template>
  <div class="card-bg list-group-item d-flex justify-content-between align-items-center">
    <div>
      <h6 class="mb-1">{{ restaurantName }}</h6>
      <small> {{ dateObj.toLocaleString() }}</small>
    </div>
    <span class="badge bg-danger rounded-pill">{{ totalAmount }} ₽</span>
  </div>
</template>

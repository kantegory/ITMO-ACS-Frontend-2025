<template>
  <h1>Арендованные объекты</h1>

  <form @submit.prevent="load">
    <input
      type="number"
      v-model="userId"
      placeholder="ID пользователя"
      class="form-control mb-3"
    >
    <button class="btn btn-primary">Загрузить</button>
  </form>
  <form @submit.prevent="createRental" class="mb-4">
    <input
      v-model="form.title"
      placeholder="Название объекта"
      class="form-control mb-2"
    >

    <input
      type="number"
      v-model="form.price"
      placeholder="Цена"
      class="form-control mb-2"
    >

    <input
      v-model="form.img"
      placeholder="URL изображения"
      class="form-control mb-2"
    >

    <button class="btn btn-success">
      Добавить объект
    </button>
  </form>

  <p v-if="rentals.length === 0">
    Объектов нет
  </p>

  <div class="row">
    <div class="col-md-4" v-for="item in rentals" :key="item.id">
      <RentalCard
        :title="item.title"
        :price="item.price"
        :img="item.img"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useRentalsStore } from '@/stores/rentals'

import RentalCard from '@/components/RentalCard.vue'

export default {
  components: { RentalCard },

  data() {
    return {
      userId: localStorage.getItem('userId') || 1,
      form: {
        title: '',
        price: '',
        img: '',
        userId: 1
      }
    }
  },

  computed: {
    ...mapState(useRentalsStore, ['rentals'])
  },

  methods: {
    ...mapActions(useRentalsStore, ['loadRentals', 'rentHouse']),
    load() {
      this.loadRentals(this.userId)
    },
    async createRental() {
      await this.rentHouse(this.form)

      this.form.title = ''
      this.form.price = ''
      this.form.img = ''
    }
  },

  mounted() {
    this.loadRentals(1)
  }
}
</script>

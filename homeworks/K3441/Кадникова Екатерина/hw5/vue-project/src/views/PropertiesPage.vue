<template>
  <base-layout>
    <h1 class="text-center">RentEstate</h1>

    <form
        ref="propertyForm"
        @submit.prevent="createCard"
        class="d-flex flex-column my-5"
    >
      <input
          type="text"
          v-model="form.title"
          placeholder="Название объекта"
          class="my-1"
          required
      />

      <textarea
          v-model="form.description"
          placeholder="Описание"
          cols="30"
          rows="3"
          class="my-1"
      />

      <select v-model="form.propertyType" class="my-1" required>
        <option disabled value="">Тип недвижимости</option>
        <option
            v-for="type in propertyTypes"
            :key="type.value"
            :value="type.value"
        >
          {{ type.label }}
        </option>
      </select>

      <select v-model="form.rentalType" class="my-1" required>
        <option disabled value="">Тип аренды</option>
        <option
            v-for="type in rentalTypes"
            :key="type.value"
            :value="type.value"
        >
          {{ type.label }}
        </option>
      </select>

      <input
          type="text"
          v-model="form.location"
          placeholder="Местоположение"
          class="my-1"
          required
      />

      <input
          type="number"
          v-model="form.price"
          placeholder="Цена"
          class="my-1"
          required
      />

      <button type="submit" class="btn btn-primary mt-2">
        Создать объявление
      </button>
    </form>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-5">
      <div class="col" v-for="property in properties" :key="property.id">
        <property-card
            :title="property.title"
            :description="property.description"
            :price="property.price"
            :location="property.location"
            :propertyType="property.propertyType"
            :rentalType="property.rentalType"
        />
      </div>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '@/layouts/BaseLayout.vue'
import PropertyCard from '@/components/PropertyCard.vue'
import { mapActions, mapState } from 'pinia'
import usePropertiesStore from '@/stores/properties'

export default {
  name: 'PropertiesPage',
  components: { BaseLayout, PropertyCard },

  data() {
    return {
      form: {
        title: '',
        description: '',
        propertyType: '',
        rentalType: '',
        location: '',
        price: null
      },

      propertyTypes: [
        { value: 'apartment', label: 'Квартира' },
        { value: 'house', label: 'Дом' },
        { value: 'villa', label: 'Вилла' },
        { value: 'cottage', label: 'Коттедж' },
        { value: 'studio', label: 'Студия' },
        { value: 'loft', label: 'Лофт' }
      ],

      rentalTypes: [
        { value: 'daily', label: 'Посуточная' },
        { value: 'monthly', label: 'Помесячная' },
        { value: 'yearly', label: 'Долгосрочная' }
      ]
    }
  },

  computed: {
    ...mapState(usePropertiesStore, ['properties'])
  },

  methods: {
    ...mapActions(usePropertiesStore, ['loadProperties', 'createProperty']),

    async createCard() {
      await this.createProperty(this.form)
      this.$refs.propertyForm.reset()
    }
  },

  mounted() {
    this.loadProperties()
  }
}
</script>
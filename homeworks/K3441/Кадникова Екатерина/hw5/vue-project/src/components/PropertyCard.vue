<template>
  <div class="card h-100 property-card shadow-sm">
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>

      <p class="card-text" v-if="description">
        {{ description }}
      </p>

      <ul class="list-unstyled mb-0">
        <li>
          <strong>Цена:</strong> {{ price }} ₽
        </li>
        <li>
          <strong>Местоположение:</strong> {{ location }}
        </li>
        <li>
          <strong>Тип недвижимости:</strong> {{ propertyTypeLabel }}
        </li>
        <li>
          <strong>Тип аренды:</strong> {{ rentalTypeLabel }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PropertyCard',

  props: {
    title: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    propertyType: { type: String, required: true },
    rentalType: { type: String, required: true }
  },

  computed: {
    propertyTypeLabel() {
      const map = {
        apartment: 'Квартира',
        house: 'Дом',
        villa: 'Вилла',
        cottage: 'Коттедж',
        studio: 'Студия',
        loft: 'Лофт'
      }
      return map[this.propertyType] ?? this.propertyType
    },

    rentalTypeLabel() {
      const map = {
        daily: 'Посуточная',
        monthly: 'Помесячная',
        yearly: 'Долгосрочная'
      }
      return map[this.rentalType] ?? this.rentalType
    }
  }
}
</script>
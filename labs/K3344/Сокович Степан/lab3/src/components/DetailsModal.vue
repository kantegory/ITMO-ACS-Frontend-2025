<template>
  <div 
    v-if="show" 
    class="modal fade show" 
    style="display: block;" 
    tabindex="-1"
    @click.self="close"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ listing?.title || 'Детали' }}</h5>
          <button type="button" class="btn-close" @click="close" aria-label="Закрыть"></button>
        </div>
        <div class="modal-body" v-if="listing">
          <img v-if="listing.image" :src="`/${listing.image}`" class="img-fluid mb-3 rounded" :alt="listing.title">
          <p><strong>Тип:</strong> {{ getTypeLabel(listing.type) }}</p>
          <p><strong>Цена:</strong> {{ formatPrice(listing.price) }} ₽ / мес</p>
          <p><strong>Район:</strong> {{ listing.location }}</p>
          <p v-if="listing.rooms"><strong>Комнат:</strong> {{ listing.rooms }}</p>
          <p v-if="listing.area"><strong>Площадь:</strong> {{ listing.area }} м²</p>
          <p><strong>Описание:</strong> {{ listing.description }}</p>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" @click="close"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  listing: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const getTypeLabel = (type) => {
  const types = {
    apartment: 'Квартира',
    house: 'Дом',
    studio: 'Студия'
  }
  return types[type] || type
}
</script>

<style scoped>
.modal-content {
  border-radius: 15px;
  padding: 20px;
}
</style>


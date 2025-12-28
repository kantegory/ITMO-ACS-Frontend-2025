<template>
  <Teleport to="body">
    <div 
      v-if="show" 
      class="modal fade show modal-overlay" 
      style="display: block;" 
      tabindex="-1"
      @click.self="close"
    >
      <div class="modal-dialog modal-dialog-centered" @click.stop>
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
    </div>
  </Teleport>
</template>

<script setup>
import { watch, onMounted, onUnmounted } from 'vue'

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

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const close = () => {
  emit('close')
}

const handleEscape = (e) => {
  if (e.key === 'Escape' && props.show) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})

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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  background-color: rgba(0, 0, 0, 0.5);
  overflow-y: auto;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 1.75rem auto;
  max-width: 500px;
  pointer-events: none;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  outline: 0;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(15px - 1px);
  border-top-right-radius: calc(15px - 1px);
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}

.btn-close {
  padding: 0.5rem 0.5rem;
  margin: -0.5rem -0.5rem -0.5rem auto;
}
</style>


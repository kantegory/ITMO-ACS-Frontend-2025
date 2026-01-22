<template>
  <div 
    v-if="modelValue"
    class="modal fade show" 
    :class="{ show: modelValue, 'd-block': modelValue }"
    tabindex="-1" 
    :aria-labelledby="bookModalLabel"
    aria-hidden="false"
    @click.self="close"
  >
    <div class="modal-dialog" @click.stop>
      <form class="modal-content" @submit.prevent="handleSubmit">
        <div class="modal-header">
          <h5 class="modal-title" :id="bookModalLabel">
            {{ property ? `Бронирование: ${property.title}` : 'Бронирование' }}
          </h5>
          <button type="button" class="btn-close" aria-label="Закрыть" @click="close"></button>
        </div>
        <div class="modal-body">
          <input v-if="property" :value="property.id" type="hidden" name="propertyId">
          <div class="mb-3">
            <label class="form-label" for="bookMoveIn">Дата заселения</label>
            <input id="bookMoveIn" v-model="moveInDate" type="date" class="form-control" required>
          </div>
          <div class="mb-3">
            <label class="form-label" for="bookMessage">Сообщение владельцу (необязательно)</label>
            <textarea id="bookMessage" v-model="message" class="form-control" rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" @click="close">Отмена</button>
          <button class="btn btn-primary" type="submit">Отправить запрос</button>
        </div>
      </form>
    </div>
  </div>
  <div v-if="modelValue" class="modal-backdrop fade show" @click="close"></div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  property: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'booked'])

const { showSuccess } = useNotifications()
const moveInDate = ref('')
const message = ref('')

const bookModalLabel = computed(() => `bookModalLabel-${props.property?.id || 'default'}`)

function close() {
  emit('update:modelValue', false)
  moveInDate.value = ''
  message.value = ''
}

async function handleSubmit() {
  if (!props.property) return
  
  await showSuccess(`Запрос на бронирование "${props.property.title}" отправлен. Владелец свяжется с вами.`)
  emit('booked')
  close()
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    // Reset form when modal opens
    moveInDate.value = ''
    message.value = ''
  }
})
</script>

<style scoped>
.modal.show {
  display: block;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
}
</style>


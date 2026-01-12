<template>
  <div 
    class="modal fade" 
    ref="modalElement" 
    tabindex="-1" 
    aria-labelledby="bookingModalLabel" 
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="bookingModalLabel">Бронирование столика</h5>
          <button type="button" class="btn-close" @click="hide"></button>
        </div>
        <div class="modal-body">
          <input 
            v-model="formData.name" 
            type="text" 
            class="form-control mb-2" 
            placeholder="Ваше имя"
          >
          <input 
            v-model="formData.email" 
            type="email" 
            class="form-control mb-2" 
            placeholder="Email"
          >
          <input 
            v-model="formData.date" 
            type="date" 
            class="form-control mb-2"
          >
          <input 
            v-model="formData.time" 
            type="time" 
            class="form-control mb-2"
          >
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="handleBooking">Забронировать</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { useAuth } from '@/composables/useAuth'
import { useBookings } from '@/composables/useBookings'
import { useToast } from '@/composables/useToast'

const modalElement = ref<HTMLElement>()
let modal: Modal | null = null

const formData = reactive({
  name: '',
  email: '',
  date: '',
  time: ''
})

const props = defineProps<{
  restaurantId: string
  restaurantName: string
}>()

const emit = defineEmits(['booking-success'])

const { currentUser } = useAuth()
const { createBooking } = useBookings()
const { showToast } = useToast()

onMounted(() => {
  if (modalElement.value) {
    modal = new Modal(modalElement.value)
  }
})

const show = () => {
  modal?.show()
}

const hide = () => {
  modal?.hide()
  formData.name = ''
  formData.email = ''
  formData.date = ''
  formData.time = ''
}

const handleBooking = async () => {
  if (!currentUser.value) {
    showToast('Сначала войдите!', 'danger')
    return
  }

  if (!formData.name || !formData.email || !formData.date || !formData.time) {
    showToast('Заполните все поля!', 'danger')
    return
  }

  try {
    await createBooking({
      userId: currentUser.value.id,
      restaurantId: props.restaurantId,
      restaurantName: props.restaurantName,
      name: formData.name,
      email: formData.email,
      date: formData.date,
      time: formData.time
    })
    
    hide()
    showToast('Столик успешно забронирован!', 'success')
    emit('booking-success')
  } catch (error) {
    showToast('Ошибка бронирования', 'danger')
  }
}

defineExpose({ show, hide })
</script>


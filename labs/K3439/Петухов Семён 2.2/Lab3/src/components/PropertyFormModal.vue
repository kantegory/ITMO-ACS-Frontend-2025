<template>
  <div 
    v-if="modelValue"
    class="modal fade show" 
    :class="{ show: modelValue, 'd-block': modelValue }"
    tabindex="-1" 
    :aria-labelledby="modalLabel"
    aria-hidden="false"
    @click.self="close"
  >
    <div class="modal-dialog modal-lg" @click.stop>
      <form class="modal-content" @submit.prevent="handleSubmit">
        <div class="modal-header">
          <h5 class="modal-title" :id="modalLabel">
            {{ isEditMode ? 'Редактировать объявление' : 'Добавить объявление' }}
          </h5>
          <button type="button" class="btn-close" aria-label="Закрыть" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label" for="formTitle">Название <span class="text-danger">*</span></label>
              <input 
                id="formTitle" 
                v-model="formData.title" 
                type="text" 
                class="form-control" 
                required
                placeholder="Например: Современная квартира в центре"
              >
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label" for="formType">Тип <span class="text-danger">*</span></label>
              <select id="formType" v-model="formData.type" class="form-select" required>
                <option value="">Выберите тип</option>
                <option value="Аппартаменты">Аппартаменты</option>
                <option value="Дом">Дом</option>
                <option value="Студия">Студия</option>
                <option value="Комната">Комната</option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label" for="formLocation">Местоположение <span class="text-danger">*</span></label>
              <input 
                id="formLocation" 
                v-model="formData.location" 
                type="text" 
                class="form-control" 
                required
                placeholder="Например: Москва, центр"
              >
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label" for="formPrice">Цена (₽/мес) <span class="text-danger">*</span></label>
              <input 
                id="formPrice" 
                v-model.number="formData.price" 
                type="number" 
                class="form-control" 
                required
                min="0"
                step="100"
                placeholder="0"
              >
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label" for="formBeds">Спальни <span class="text-danger">*</span></label>
              <input 
                id="formBeds" 
                v-model.number="formData.beds" 
                type="number" 
                class="form-control" 
                required
                min="0"
                placeholder="0"
              >
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label" for="formBaths">Ванные <span class="text-danger">*</span></label>
              <input 
                id="formBaths" 
                v-model.number="formData.baths" 
                type="number" 
                class="form-control" 
                required
                min="0"
                placeholder="0"
              >
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label" for="formDescription">Описание <span class="text-danger">*</span></label>
            <textarea 
              id="formDescription" 
              v-model="formData.description" 
              class="form-control" 
              rows="4"
              required
              placeholder="Опишите ваше объявление..."
            ></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label" for="formRentTerms">Условия аренды</label>
            <textarea 
              id="formRentTerms" 
              v-model="formData.rentTerms" 
              class="form-control" 
              rows="2"
              placeholder="Например: Минимальный срок аренды — 6 месяцев. Залог: стоимость одного месяца."
            ></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label" for="formImages">URL изображений (по одному на строку)</label>
            <textarea 
              id="formImages" 
              v-model="imagesText" 
              class="form-control" 
              rows="3"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            ></textarea>
            <small class="form-text text-muted">Введите URL изображений, каждое с новой строки</small>
          </div>

          <div class="mb-3">
            <label class="form-label" for="formStatus">Статус</label>
            <select id="formStatus" v-model="formData.status" class="form-select">
              <option value="available">Доступно</option>
              <option value="rented">Сдано</option>
              <option value="pending">Ожидает</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" @click="close">Отмена</button>
          <button class="btn btn-primary" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Сохранение...' : (isEditMode ? 'Сохранить' : 'Добавить') }}
          </button>
        </div>
      </form>
    </div>
  </div>
  <div v-if="modelValue" class="modal-backdrop fade show" @click="close"></div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

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

const emit = defineEmits(['update:modelValue', 'saved'])

const isSubmitting = ref(false)
const imagesText = ref('')

const isEditMode = computed(() => !!props.property)

const modalLabel = computed(() => `propertyFormModal-${props.property?.id || 'new'}`)

const formData = ref({
  title: '',
  type: '',
  location: '',
  price: 0,
  beds: 0,
  baths: 0,
  description: '',
  rentTerms: '',
  images: [],
  status: 'available'
})

function resetForm() {
  formData.value = {
    title: '',
    type: '',
    location: '',
    price: 0,
    beds: 0,
    baths: 0,
    description: '',
    rentTerms: '',
    images: [],
    status: 'available'
  }
  imagesText.value = ''
}

function loadPropertyData() {
  if (props.property) {
    formData.value = {
      title: props.property.title || '',
      type: props.property.type || '',
      location: props.property.location || '',
      price: props.property.price || 0,
      beds: props.property.beds || 0,
      baths: props.property.baths || 0,
      description: props.property.description || '',
      rentTerms: props.property.rentTerms || '',
      images: Array.isArray(props.property.images) ? [...props.property.images] : [],
      status: props.property.status || 'available'
    }
    imagesText.value = Array.isArray(props.property.images) 
      ? props.property.images.join('\n') 
      : ''
  } else {
    resetForm()
  }
}

function close() {
  emit('update:modelValue', false)
  resetForm()
}

async function handleSubmit() {
  isSubmitting.value = true
  
  try {
    // Parse images from text
    const images = imagesText.value
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)
    
    const data = {
      ...formData.value,
      images: images.length > 0 ? images : formData.value.images
    }
    
    emit('saved', data)
    close()
  } catch (error) {
    console.error('Ошибка при сохранении:', error)
  } finally {
    isSubmitting.value = false
  }
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    loadPropertyData()
  }
})

watch(() => props.property, () => {
  if (props.modelValue) {
    loadPropertyData()
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


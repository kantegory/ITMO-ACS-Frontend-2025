<template>
  <div>
    <Navbar />
    <main id="main-content" class="container mt-4">
      <nav aria-label="Хлебные крошки">
        <div class="mb-3">
          <router-link 
            to="/search" 
            class="btn btn-outline-secondary d-inline-flex align-items-center"
            aria-label="Вернуться к результатам поиска"
          >
            <Icon name="arrow-left" size="md" extra-class="me-2 icon-inline" />
            <span>Назад к поиску</span>
          </router-link>
        </div>
      </nav>

      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <div v-else-if="property">
        <div class="row">
          <!-- Галерея изображений -->
          <div class="col-md-8 mb-4">
            <PropertyGallery 
              :images="property.images" 
              :title="property.title"
              :location="property.location"
            />
          </div>

          <!-- Информация о недвижимости -->
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <h1 class="h2 card-title">{{ property.title }}</h1>
                <p class="text-muted mb-3">{{ property.location }}</p>
                <p class="h3 text-primary mb-4">{{ formatPrice(property.price) }}</p>
                <button 
                  class="btn btn-primary btn-lg w-100 mb-3 d-inline-flex align-items-center justify-content-center"
                  @click="showContactModal = true"
                  aria-label="Открыть форму связи с владельцем недвижимости"
                >
                  <Icon name="phone" size="md" extra-class="me-2 icon-inline" />
                  <span>Связаться с владельцем</span>
                </button>
                <button 
                  class="btn btn-outline-primary w-100 d-inline-flex align-items-center justify-content-center"
                  @click="showRentModal = true"
                  aria-label="Открыть форму оформления аренды"
                >
                  <Icon name="building" size="md" extra-class="me-2 icon-inline" />
                  <span>Арендовать</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-md-8">
            <div class="card mb-4">
              <div class="card-body">
                <h2 class="h4 card-title">Описание</h2>
                <p class="card-text">{{ property.description }}</p>
              </div>
            </div>

            <div class="card mb-4">
              <div class="card-body">
                <h2 class="h4 card-title">Характеристики</h2>
                <ul class="list-unstyled">
                  <li><strong>Тип:</strong> {{ getTypeName(property.type) }}</li>
                  <li><strong>Комнат:</strong> {{ property.rooms }}</li>
                  <li><strong>Площадь:</strong> {{ property.area }} м²</li>
                  <li><strong>Этаж:</strong> {{ property.floor }} из {{ property.totalFloors }}</li>
                </ul>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h2 class="h4 card-title">Условия аренды</h2>
                <ul>
                  <li v-for="(condition, index) in property.conditions" :key="index" class="mb-2">
                    {{ condition }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Модальное окно для связи -->
      <div v-if="showContactModal" class="modal show d-block" tabindex="-1" @click.self="showContactModal = false">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Связаться с владельцем</h5>
              <button type="button" class="btn-close" @click="showContactModal = false" aria-label="Закрыть окно"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handleContact">
                <div class="mb-3">
                  <label for="contactName" class="form-label">Ваше имя</label>
                  <input type="text" class="form-control" id="contactName" v-model="contactForm.name" required>
                </div>
                <div class="mb-3">
                  <label for="contactPhone" class="form-label">Телефон</label>
                  <input type="tel" class="form-control" id="contactPhone" v-model="contactForm.phone" required>
                </div>
                <div class="mb-3">
                  <label for="contactMessage" class="form-label">Сообщение</label>
                  <textarea class="form-control" id="contactMessage" v-model="contactForm.message" rows="3" required></textarea>
                </div>
                <div class="d-flex gap-2">
                  <button type="button" class="btn btn-secondary flex-fill" @click="showContactModal = false">Отмена</button>
                  <button type="submit" class="btn btn-primary flex-fill">Отправить</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showContactModal" class="modal-backdrop show"></div>

      <!-- Модальное окно для аренды -->
      <div v-if="showRentModal" class="modal show d-block" tabindex="-1" @click.self="showRentModal = false">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Оформить аренду</h5>
              <button type="button" class="btn-close" @click="showRentModal = false" aria-label="Закрыть окно"></button>
            </div>
            <div class="modal-body">
              <RentForm 
                :price="property?.price || 0"
                :loading="renting"
                @submit="handleRent"
                @cancel="showRentModal = false"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="showRentModal" class="modal-backdrop show"></div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/common/Navbar.vue'
import Icon from '@/components/common/Icon.vue'
import PropertyGallery from '@/components/property/PropertyGallery.vue'
import RentForm from '@/components/forms/RentForm.vue'
import { useProperties } from '@/composables/useProperties'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { getApartmentById, rentApartment } = useProperties()
const { currentUser } = useAuth()

const property = ref(null)
const loading = ref(true)
const error = ref('')
const showContactModal = ref(false)
const showRentModal = ref(false)
const renting = ref(false)

const contactForm = ref({
  name: '',
  phone: '',
  message: ''
})

const typeNames = {
  apartment: 'Квартира',
  house: 'Дом',
  office: 'Офис',
  studio: 'Студия'
}

const getTypeName = (type) => typeNames[type] || type

const formatPrice = (price) => {
  return `${price.toLocaleString('ru-RU')} ₽/мес`
}

onMounted(async () => {
  const propertyId = parseInt(route.params.id)
  if (!propertyId) {
    error.value = 'Недвижимость не найдена'
    loading.value = false
    return
  }

  try {
    property.value = await getApartmentById(propertyId)
    if (!property.value) {
      error.value = 'Недвижимость не найдена'
    }
  } catch (err) {
    error.value = 'Ошибка загрузки недвижимости'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const handleContact = () => {
  // Здесь можно добавить отправку сообщения
  showContactModal.value = false
  contactForm.value = { name: '', phone: '', message: '' }
}

const handleRent = async (rentData) => {
  if (!currentUser.value) {
    router.push('/login')
    return
  }

  if (!property.value) return

  renting.value = true
  try {
    await rentApartment(property.value.id, currentUser.value.id, rentData)
    showRentModal.value = false
    router.push('/profile')
  } catch (err) {
    console.error('Ошибка аренды:', err)
    // Ошибка будет показана в форме
  } finally {
    renting.value = false
  }
}
</script>

<style scoped>
.modal.show {
  display: block;
}
.modal-backdrop.show {
  opacity: 0.5;
}
</style>

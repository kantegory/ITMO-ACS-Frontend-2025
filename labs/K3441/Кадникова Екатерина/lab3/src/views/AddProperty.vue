<template>
  <div class="container my-4">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4>
              <svg class="icon me-2" aria-hidden="true">
                <use href="#icon-plus-circle" />
              </svg>
              Добавить новый объект недвижимости
            </h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit" novalidate :class="{ 'was-validated': wasValidated }">
              <div class="form-section mb-4">
                <h5>
                  <svg class="icon me-2" aria-hidden="true">
                    <use href="#icon-info-circle" />
                  </svg>
                  Основная информация
                </h5>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="title" class="form-label">Название объекта *</label>
                    <input
                        type="text"
                        id="title"
                        class="form-control"
                        v-model="form.title"
                        required
                        placeholder="Например: Уютная квартира в центре"
                    />
                    <div class="invalid-feedback">Пожалуйста, введите название объекта</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="location" class="form-label">Местоположение *</label>
                    <input
                        type="text"
                        id="location"
                        class="form-control"
                        v-model="form.location"
                        required
                        placeholder="Например: Москва, Центральный район"
                    />
                    <div class="invalid-feedback">Пожалуйста, укажите местоположение</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="description" class="form-label">Описание</label>
                  <textarea
                      id="description"
                      class="form-control"
                      rows="4"
                      v-model="form.description"
                      placeholder="Опишите ваш объект: расположение, особенности, инфраструктура вокруг..."
                  ></textarea>
                </div>
              </div>

              <div class="form-section mb-4">
                <h5>
                  <svg class="icon me-2" aria-hidden="true">
                    <use href="#icon-tags" />
                  </svg>
                  Тип и цена
                </h5>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="propertyType" class="form-label">Тип недвижимости *</label>
                    <select id="propertyType" class="form-select" v-model="form.propertyType" required>
                      <option value="">Выберите тип...</option>
                      <option v-for="(label, value) in propertyTypeMap" :key="value" :value="value">
                        {{ label }}
                      </option>
                    </select>
                    <div class="invalid-feedback">Пожалуйста, выберите тип недвижимости</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="rentalType" class="form-label">Тип аренды *</label>
                    <select id="rentalType" class="form-select" v-model="form.rentalType" required @change="updatePriceUnit">
                      <option value="">Выберите тип аренды...</option>
                      <option v-for="(label, value) in rentalTypeMap" :key="value" :value="value">
                        {{ label }}
                      </option>
                    </select>
                    <div class="invalid-feedback">Пожалуйста, выберите тип аренды</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="price" class="form-label">Стоимость аренды *</label>
                  <div class="input-group price-input">
                    <input
                        type="number"
                        id="price"
                        class="form-control"
                        v-model.number="form.price"
                        min="0"
                        step="1000"
                        required
                        placeholder="Например: 50000"
                    />
                    <span class="input-group-text">{{ priceUnit }}</span>
                    <div class="invalid-feedback">Пожалуйста, укажите стоимость аренды</div>
                  </div>
                  <small class="form-text text-muted">Укажите стоимость за выбранный период аренды</small>
                </div>
              </div>

              <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                <router-link to="/profile" class="btn btn-outline-secondary me-md-2">
                  <svg class="icon me-1" aria-hidden="true">
                    <use href="#icon-arrow-left" />
                  </svg>
                  Назад к профилю
                </router-link>
                <button type="submit" class="btn btn-primary" :disabled="submitting">
                  <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ submitting ? 'Создание...' : 'Создать объект' }}
                </button>
              </div>

              <div v-if="message.text" :class="`alert alert-${message.type} mt-3`">{{ message.text }}</div>
            </form>
          </div>
        </div>

        <div class="card shadow mt-4">
          <div class="card-body">
            <h6>
              <svg class="icon me-2" aria-hidden="true">
                <use href="#icon-lightbulb" />
              </svg>
              Советы по заполнению
            </h6>
            <ul class="mb-0">
              <li class="small">Указывайте реальные и актуальные данные</li>
              <li class="small">Добавляйте качественные фотографии объекта</li>
              <li class="small">Подробное описание увеличивает шансы на аренду</li>
              <li class="small">Укажите все доступные удобства</li>
              <li class="small">Проверьте правильность контактной информации</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createProperty, propertyTypeMap, rentalTypeMap } from '@/api/properties.api'
import { useUserStore } from '@/stores/userStore.js'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  title: '',
  location: '',
  description: '',
  propertyType: '',
  rentalType: '',
  price: null
})

const wasValidated = ref(false)
const submitting = ref(false)
const message = reactive({ text: '', type: '' })
const priceUnit = ref('₽')

onMounted(() => {
  updatePriceUnit()
})

function updatePriceUnit() {
  switch (form.rentalType) {
    case 'daily': priceUnit.value = '₽/день'; break
    case 'monthly': priceUnit.value = '₽/месяц'; break
    case 'yearly': priceUnit.value = '₽/год'; break
    default: priceUnit.value = '₽'
  }
}

async function handleSubmit() {
  wasValidated.value = true

  if (!form.title || !form.location || !form.propertyType || !form.rentalType || !form.price || form.price <= 0) {
    showMessage('Пожалуйста, заполните все поля корректно', 'danger')
    return
  }

  submitting.value = true

  try {
    await createProperty({ ...form })
    showMessage('Объект недвижимости успешно создан!', 'success')
    setTimeout(() => router.push('/profile'), 1500)
  } catch (err) {
    console.error(err)
    showMessage(`Ошибка создания объекта: ${err.message}`, 'danger')
    submitting.value = false
  }
}

function showMessage(text, type = 'info') {
  message.text = text
  message.type = type
  if (type !== 'danger') {
    setTimeout(() => message.text = '', 5000)
  }
}
</script>

<style scoped>
.price-input input {
  min-width: 120px;
}
</style>
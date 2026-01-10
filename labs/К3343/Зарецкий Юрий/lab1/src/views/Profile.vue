<template>
  <div>
    <Navbar />
    <main id="main-content" class="container mt-4">
      <h1 class="mb-4">Личный кабинет</h1>
      
      <div class="row mb-4">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="card-title">Информация о пользователе</h5>
                  <p class="mb-1"><strong>Имя:</strong> {{ currentUser?.fullName || 'Загрузка...' }}</p>
                  <p class="mb-1"><strong>Email:</strong> {{ currentUser?.email || 'Загрузка...' }}</p>
                  <p class="mb-0"><strong>Телефон:</strong> {{ currentUser?.phone || 'Загрузка...' }}</p>
                </div>
                <button class="btn btn-danger" @click="handleLogout" aria-label="Выйти из личного кабинета">
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-3">Моя арендующаяся недвижимость</h2>
          <div v-if="loadingRenting" class="text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Загрузка...</span>
            </div>
          </div>
          <div v-else-if="rentingProperties.length === 0" class="row">
            <div class="col-12">
              <div class="alert alert-info">У вас нет недвижимости для сдачи</div>
            </div>
          </div>
          <div v-else class="row">
            <PropertyCard 
              v-for="property in rentingProperties" 
              :key="property.id" 
              :property="property" 
            />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <h2 class="mb-3">Моя арендованная недвижимость</h2>
          <div v-if="loadingRented" class="text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Загрузка...</span>
            </div>
          </div>
          <div v-else-if="rentedProperties.length === 0" class="row">
            <div class="col-12">
              <div class="alert alert-info">Вы еще не арендовали недвижимость</div>
            </div>
          </div>
          <div v-else class="row">
            <div 
              v-for="rent in rentedProperties" 
              :key="rent.id"
              class="col-md-6 col-lg-4 mb-4"
            >
              <div class="card h-100">
                <img 
                  :src="rent.image" 
                  class="card-img-top" 
                  :alt="`Фотография арендованной недвижимости: ${rent.title}, расположена по адресу ${rent.location}, арендована с ${rent.startDate} по ${rent.endDate}`"
                  style="height: 200px; object-fit: cover;"
                >
                <div class="card-body">
                  <h5 class="card-title">{{ rent.title }}</h5>
                  <p class="card-text text-muted">{{ rent.location }}</p>
                  <p class="card-text"><strong>{{ rent.price.toLocaleString('ru-RU') }} ₽/мес</strong></p>
                  <p class="card-text"><span class="badge bg-info">Арендована</span></p>
                  <p class="card-text small text-muted">
                    С {{ formatDate(rent.startDate) }} по {{ formatDate(rent.endDate) }}
                  </p>
                  <router-link 
                    :to="`/property/${rent.apartmentId}`" 
                    class="btn btn-primary btn-sm"
                  >
                    Подробнее
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/common/Navbar.vue'
import PropertyCard from '@/components/property/PropertyCard.vue'
import { useAuth } from '@/composables/useAuth'
import { useProperties } from '@/composables/useProperties'
import { formatDate } from '@/utils/dateFormatter'

const router = useRouter()
const { currentUser, logout, isAuthenticated } = useAuth()
const { getUserApartments, getRentedApartments, getApartmentById } = useProperties()

const rentingProperties = ref([])
const rentedProperties = ref([])
const loadingRenting = ref(false)
const loadingRented = ref(false)

const handleLogout = () => {
  logout()
  router.push('/')
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  if (!currentUser.value) {
    router.push('/login')
    return
  }

  // Загружаем недвижимость, которую пользователь сдает
  loadingRenting.value = true
  try {
    const properties = await getUserApartments(currentUser.value.id)
    rentingProperties.value = properties.map(apt => ({
      ...apt,
      image: apt.images && apt.images.length > 0 
        ? apt.images[0] 
        : "https://via.placeholder.com/300x200?text=Нет+фото"
    }))
  } catch (err) {
    console.error('Ошибка загрузки недвижимости:', err)
  } finally {
    loadingRenting.value = false
  }

  // Загружаем арендованную недвижимость
  loadingRented.value = true
  try {
    const rentedData = await getRentedApartments(currentUser.value.id)
    const rentedWithDetails = await Promise.all(
      rentedData.map(async (rent) => {
        if (!rent.apartmentId) {
          console.warn('Запись об аренде без apartmentId:', rent)
          return null
        }
        const apartment = await getApartmentById(rent.apartmentId)
        if (!apartment) return null
        
        return {
          ...rent,
          title: apartment.title,
          location: apartment.location,
          price: apartment.price,
          image: apartment.images && apartment.images.length > 0 
            ? apartment.images[0] 
            : "https://via.placeholder.com/300x200?text=Нет+фото"
        }
      })
    )
    rentedProperties.value = rentedWithDetails.filter(item => item !== null)
  } catch (err) {
    console.error('Ошибка загрузки арендованной недвижимости:', err)
  } finally {
    loadingRented.value = false
  }
})
</script>

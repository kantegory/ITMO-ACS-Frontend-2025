<template>
  <main v-if="property" class="container py-4" role="main">
    <div class="row">
      <article class="col-lg-8" aria-labelledby="propTitle">
        <div id="propTitle" class="h3">{{ property.title }}</div>
        <div class="text-muted mb-2">{{ property.location }} • {{ property.type }}</div>

        <div id="propCarousel" class="carousel slide mb-3" aria-label="Фотогалерея объявления">
          <div class="carousel-inner">
            <div 
              v-for="(img, idx) in gallery" 
              :key="idx"
              class="carousel-item"
              :class="{ active: idx === 0 }"
            >
              <img :src="img" class="d-block w-100 property-carousel-img" :alt="`${property.title} — фото ${idx + 1}`">
            </div>
          </div>
          <button 
            v-if="gallery.length > 1"
            class="carousel-control-prev" 
            type="button" 
            data-bs-target="#propCarousel" 
            data-bs-slide="prev" 
            aria-label="Предыдущее фото"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button 
            v-if="gallery.length > 1"
            class="carousel-control-next" 
            type="button" 
            data-bs-target="#propCarousel" 
            data-bs-slide="next" 
            aria-label="Следующее фото"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>

        <section aria-labelledby="descriptionHeading" class="mb-4">
          <h2 id="descriptionHeading" class="h5">Описание</h2>
          <p class="text-muted">{{ property.description }}</p>
        </section>

        <section aria-labelledby="termsHeading">
          <h2 id="termsHeading" class="h5">Условия аренды</h2>
          <p class="text-muted">{{ property.rentTerms }}</p>
        </section>
      </article>

      <aside class="col-lg-4" aria-label="Действия и контакты" role="complementary">
        <div class="card card-custom p-3" aria-live="polite">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="text-muted small">{{ property.beds }} спал. • {{ property.baths }} ван.</div>
              <p class="h4 mb-0">₽{{ property.price }}/мес</p>
            </div>
            <div class="text-end">
              <button class="btn btn-outline-secondary mb-2" @click="handleContact">Связаться с владельцем</button>
              <button class="btn btn-primary d-block" @click="showBookingModal = true">Забронировать</button>
            </div>
          </div>
        </div>
        <div class="card card-custom mt-3 p-3" aria-label="Контактные данные">
          <small class="text-muted">Данные владельца (демо)</small>
          <div class="mt-2"><strong>Имя владельца</strong><div class="text-muted small">owner@example.com</div></div>
        </div>
      </aside>
    </div>
  </main>
  <main v-else class="container py-5">
    <h3>Объявление не найдено.</h3>
  </main>

  <BookingModal 
    v-model="showBookingModal"
    :property="property"
    @booked="handleBooked"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDataService } from '@/composables/useDataService'
import { useNotifications } from '@/composables/useNotifications'
import BookingModal from '@/components/BookingModal.vue'

const route = useRoute()
const router = useRouter()
const { getCurrentUser } = useAuth()
const { getPropertyById, normalizeId } = useDataService()
const { showModal, prompt } = useNotifications()

const property = ref(null)
const showBookingModal = ref(false)

const gallery = computed(() => {
  if (!property.value) return []
  return property.value.images && property.value.images.length 
    ? property.value.images 
    : ['https://via.placeholder.com/800x420?text=No+image']
})

async function handleContact() {
  const user = getCurrentUser()
  if (!user) {
    await showModal({
      title: 'Требуется вход',
      message: 'Пожалуйста, войдите, чтобы связаться с владельцем.',
      type: 'warning'
    })
    router.push('/login')
    return
  }
  
  const msg = await prompt({
    title: 'Сообщение владельцу',
    message: `Напишите сообщение владельцу объекта "${property.value.title}"`,
    placeholder: 'Ваше сообщение',
    type: 'info'
  })
  
  if (msg) {
    await showModal({
      title: 'Готово',
      message: 'Сообщение отправлено (демо).',
      type: 'success'
    })
  }
}

function handleBooked() {
  showBookingModal.value = false
}

onMounted(async () => {
  const idParam = route.params.id
  const propId = normalizeId(idParam)
  
  if (!propId) {
    return
  }
  
  const prop = await getPropertyById(propId)
  if (!prop) {
    return
  }
  
  property.value = prop
})
</script>


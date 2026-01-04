<template>
  <main class="container py-4" role="main">
    <section class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3" aria-labelledby="dashWelcome">
      <div>
        <h1 id="dashWelcome" class="h3 mb-1">Добро пожаловать{{ user ? `, ${user.name}` : '' }}</h1>
        <p class="text-muted mb-0">Управляйте объявлениями и контролируйте активные аренды.</p>
      </div>
      <div class="mt-3 mt-md-0">
        <button @click="openAddForm" class="btn btn-success me-2">+ Добавить объявление</button>
        <RouterLink to="/messages" class="btn btn-outline-secondary me-2">Сообщения</RouterLink>
        <RouterLink to="/" class="btn btn-primary">Поиск</RouterLink>
      </div>
    </section>

    <div class="row" aria-live="polite" aria-atomic="true">
      <section class="col-md-6 mb-4" aria-labelledby="ownedHeading">
        <h2 id="ownedHeading" class="h5">Ваши объявления</h2>
        <div role="list">
          <div 
            v-for="prop in ownedProperties" 
            :key="prop.id"
            class="list-item"
            role="listitem"
            :aria-label="`${prop.title}, ${prop.location}`"
          >
            <img :src="getCoverImage(prop)" class="list-thumb" :alt="prop.title">
            <div class="flex-fill">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{{ prop.title }}</strong>
                  <div class="text-muted small">{{ prop.location }} • {{ prop.type }}</div>
                </div>
                <div class="text-end">
                  <div class="fw-semibold">₽{{ prop.price }}/мес</div>
                  <small class="text-muted">{{ statusText(prop.status) }}</small>
                </div>
              </div>
              <div class="mt-2">
                <RouterLink :to="`/property/${prop.id}`" class="btn btn-sm btn-outline-primary me-2">Просмотр</RouterLink>
                <button class="btn btn-sm btn-outline-secondary me-2" @click="openEditForm(prop)">Редактировать</button>
                <button class="btn btn-sm btn-danger" @click="handleDelete(prop.id)">Удалить</button>
              </div>
            </div>
          </div>
          <div v-if="ownedProperties.length === 0" class="text-muted">Нет объявлений</div>
        </div>
      </section>
      <section class="col-md-6 mb-4" aria-labelledby="rentedHeading">
        <h2 id="rentedHeading" class="h5">Арендованные</h2>
        <div role="list">
          <div 
            v-for="prop in rentedProperties" 
            :key="prop.id"
            class="list-item"
            role="listitem"
            :aria-label="`${prop.title}, ${prop.location}`"
          >
            <img :src="getCoverImage(prop)" class="list-thumb" :alt="prop.title">
            <div class="flex-fill">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{{ prop.title }}</strong>
                  <div class="text-muted small">{{ prop.location }} • {{ prop.type }}</div>
                </div>
                <div class="text-end">
                  <div class="fw-semibold">₽{{ prop.price }}/мес</div>
                  <small class="text-muted">{{ statusText(prop.status) }}</small>
                </div>
              </div>
              <div class="mt-2">
                <RouterLink :to="`/property/${prop.id}`" class="btn btn-sm btn-outline-primary me-2">Просмотр</RouterLink>
              </div>
            </div>
          </div>
          <div v-if="rentedProperties.length === 0" class="text-muted">Нет арендованных объявлений</div>
        </div>
      </section>
    </div>

    <PropertyFormModal 
      v-model="showFormModal" 
      :property="selectedProperty"
      @saved="handlePropertySaved"
    />
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDataService } from '@/composables/useDataService'
import { useNotifications } from '@/composables/useNotifications'
import PropertyFormModal from '@/components/PropertyFormModal.vue'

const router = useRouter()
const { currentUser, logout } = useAuth()
const { fetchAdvertisement, deleteAdvertisement, createAdvertisement, updateAdvertisement, normalizeId, statusText } = useDataService()
const { confirm, showSuccess } = useNotifications()

const user = computed(() => currentUser.value)
const properties = ref([])
const showFormModal = ref(false)
const selectedProperty = ref(null)

const ownedProperties = computed(() => {
  if (!user.value) return []
  const userId = normalizeId(user.value.id)
  return properties.value.filter(p => normalizeId(p.ownerId) === userId)
})

const rentedProperties = computed(() => {
  if (!user.value) return []
  const userId = normalizeId(user.value.id)
  return properties.value.filter(p => normalizeId(p.tenantId) === userId)
})

function getCoverImage(prop) {
  return prop.images && prop.images.length 
    ? prop.images[0] 
    : 'https://via.placeholder.com/100x70?text=No+image'
}

function openAddForm() {
  selectedProperty.value = null
  showFormModal.value = true
}

function openEditForm(property) {
  selectedProperty.value = property
  showFormModal.value = true
}

async function handlePropertySaved(data) {
  if (!user.value) return
  
  const userId = normalizeId(user.value.id)
  let saved
  
  if (selectedProperty.value) {
    // Редактирование - сохраняем все существующие поля и обновляем только измененные
    const updateData = {
      ...selectedProperty.value,
      ...data,
      ownerId: userId,
      id: selectedProperty.value.id
    }
    saved = await updateAdvertisement(selectedProperty.value.id, updateData)
    if (saved) {
      const index = properties.value.findIndex(p => p.id === selectedProperty.value.id)
      if (index !== -1) {
        properties.value[index] = saved
      }
      await showSuccess('Объявление обновлено.')
    }
  } else {
    // Создание - не передаем id, json-server сгенерирует его
    const createData = {
      ...data,
      ownerId: userId
    }
    // Удаляем id если он есть (для нового объявления)
    delete createData.id
    saved = await createAdvertisement(createData)
    if (saved) {
      properties.value.push(saved)
      await showSuccess('Объявление добавлено.')
    }
  }
}

async function handleDelete(advId) {
  const confirmed = await confirm({
    title: 'Удалить объявление?',
    message: 'Действие нельзя отменить.',
    confirmText: 'Удалить',
    type: 'danger'
  })
  
  if (!confirmed) return
  
  const ok = await deleteAdvertisement(advId)
  if (ok) {
    properties.value = properties.value.filter(p => p.id !== advId)
    await showSuccess('Объявление удалено.')
  }
}

onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }
  
  properties.value = await fetchAdvertisement()
})
</script>


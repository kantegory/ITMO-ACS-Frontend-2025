<template>
  <main class="container my-5" role="main">
    <div v-if="user" class="card mx-auto shadow-sm profile-card">
      <div class="row g-0">
        <div class="col-md-4 text-center bg-light p-4">
          <img 
            :src="user.avatar || 'https://via.placeholder.com/180'" 
            alt="Аватар пользователя" 
            class="img-fluid rounded-circle mb-3 profile-avatar" 
            role="img"
          >
          <div>
            <button class="btn btn-sm btn-outline-primary" @click="showEditModal = true">
              Редактировать профиль
            </button>
          </div>
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h4 class="card-title mb-1">{{ user.name }}</h4>
            <div class="text-muted mb-3"><span>{{ user.email }}</span></div>

            <div class="row mb-2">
              <div class="col-6">
                <strong>Имя в системе</strong>
                <div class="text-muted">{{ user.username || (user.email ? user.email.split('@')[0] : '') }}</div>
              </div>
              <div class="col-6">
                <strong>Местоположение</strong>
                <div class="text-muted">{{ user.location || '—' }}</div>
              </div>
            </div>

            <div class="mb-3">
              <strong>О себе</strong>
              <p class="text-muted">{{ user.about || 'Короткая информация о пользователе.' }}</p>
            </div>

            <div>
              <RouterLink to="/dashboard" class="btn btn-outline-secondary me-2">Мои объявления</RouterLink>
              <RouterLink to="/" class="btn btn-outline-secondary">Поиск объявлений</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div 
      v-if="showEditModal"
      class="modal fade show d-block" 
      tabindex="-1" 
      aria-labelledby="profileModalLabel" 
      aria-hidden="false"
      @click.self="showEditModal = false"
    >
      <div class="modal-dialog modal-dialog-centered" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="profileModalLabel">Редактировать профиль</h5>
            <button type="button" class="btn-close" aria-label="Закрыть" @click="showEditModal = false"></button>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="modal-body">
              <div class="mb-2">
                <label class="form-label" for="profileNameInput">Полное имя</label>
                <input id="profileNameInput" v-model="formData.name" name="name" type="text" class="form-control" required>
              </div>
              <div class="mb-2">
                <label class="form-label" for="profileEmailInput">Эл. почта</label>
                <input id="profileEmailInput" v-model="formData.email" name="email" type="email" class="form-control" required>
              </div>
              <div class="mb-2">
                <label class="form-label" for="profileUsernameInput">Имя в системе</label>
                <input id="profileUsernameInput" v-model="formData.username" name="username" type="text" class="form-control">
              </div>
              <div class="mb-2">
                <label class="form-label" for="profileLocationInput">Местоположение</label>
                <input id="profileLocationInput" v-model="formData.location" name="location" type="text" class="form-control">
              </div>
              <div class="mb-2">
                <label class="form-label" for="profileAvatarInput">Ссылка на аватар</label>
                <input id="profileAvatarInput" v-model="formData.avatar" name="avatar" type="url" class="form-control" placeholder="https://...">
              </div>
              <div class="mb-2">
                <label class="form-label" for="profileAboutInput">О себе</label>
                <textarea id="profileAboutInput" v-model="formData.about" name="about" class="form-control" rows="3"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showEditModal = false">Отмена</button>
              <button type="submit" class="btn btn-primary">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-if="showEditModal" class="modal-backdrop fade show" @click="showEditModal = false"></div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDataService } from '@/composables/useDataService'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const { currentUser, setCurrentUser, logout } = useAuth()
const { getUserById, updateUser, normalizeId } = useDataService()
const { showModal } = useNotifications()

const user = computed(() => currentUser.value)
const showEditModal = ref(false)
const formData = reactive({
  name: '',
  email: '',
  username: '',
  location: '',
  avatar: '',
  about: ''
})

async function loadUser() {
  if (!user.value) {
    router.push('/login')
    return
  }
  
  const fresh = await getUserById(user.value.id)
  if (!fresh) {
    logout()
    router.push('/login')
    return
  }
  
  setCurrentUser(fresh)
  // Update form data when user loads
  formData.name = fresh.name || ''
  formData.email = fresh.email || ''
  formData.username = fresh.username || ''
  formData.location = fresh.location || ''
  formData.avatar = fresh.avatar || ''
  formData.about = fresh.about || ''
}

async function handleSubmit() {
  const name = formData.name.trim()
  const email = formData.email.trim()
  
  if (!name || !email) {
    await showModal({
      title: 'Проверьте данные',
      message: 'Имя и эл. почта обязательны.',
      type: 'danger'
    })
    return
  }
  
  const cur = user.value
  const curId = normalizeId(cur?.id)
  if (!curId) {
    logout()
    return
  }
  
  const updated = await updateUser(curId, {
    name,
    email,
    username: formData.username.trim(),
    location: formData.location.trim(),
    avatar: formData.avatar.trim(),
    about: formData.about.trim()
  })
  
  if (!updated) return
  
  setCurrentUser(updated)
  showEditModal.value = false
}

watch(showEditModal, (newVal) => {
  if (newVal && user.value) {
    formData.name = user.value.name || ''
    formData.email = user.value.email || ''
    formData.username = user.value.username || ''
    formData.location = user.value.location || ''
    formData.avatar = user.value.avatar || ''
    formData.about = user.value.about || ''
  }
})

onMounted(() => {
  loadUser()
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


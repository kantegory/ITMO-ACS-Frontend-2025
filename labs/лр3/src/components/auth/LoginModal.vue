<template>
  <div class="modal fade" id="loginModal" tabindex="-1" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content glass-card">
        <div class="modal-header border-0">
          <h2 class="modal-title elegant-heading">Log In</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-control" required placeholder="Enter email">
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="form.password" type="password" class="form-control" required placeholder="Enter password">
            </div>
            <button type="submit" class="btn btn-form-primary w-100" :disabled="loading">{{ loading ? 'Logging in...' : 'Log In' }}</button>
          </form>
          <p class="text-center text-muted mt-3 mb-0">Don't have an account? <a href="#" class="light-blue-text" @click.prevent="$emit('switchToRegister')">Register</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'LoginModal',
  emits: ['switchToRegister', 'success'],
  setup(props, { emit, expose }) {
    const { login } = useAuth()
    const modalRef = ref(null)
    const loading = ref(false)
    let modalInstance = null
    const form = ref({ email: '', password: '' })

    onMounted(() => { if (modalRef.value) modalInstance = new Modal(modalRef.value) })

    const handleSubmit = async () => {
      loading.value = true
      const result = await login(form.value.email, form.value.password)
      loading.value = false
      if (result.success) { modalInstance?.hide(); form.value = { email: '', password: '' }; emit('success') }
    }

    const show = () => modalInstance?.show()
    const hide = () => modalInstance?.hide()
    expose({ show, hide })

    return { modalRef, form, loading, handleSubmit }
  }
}
</script>

<template>
  <div class="modal fade" id="registerModal" tabindex="-1" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content glass-card">
        <div class="modal-header border-0">
          <h2 class="modal-title elegant-heading">Create Account</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">First Name</label>
              <input v-model="form.firstName" type="text" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Last Name</label>
              <input v-model="form.lastName" type="text" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="form.password" type="password" class="form-control" required minlength="6">
              <div class="form-text">Minimum 6 characters</div>
            </div>
            <button type="submit" class="btn btn-form-primary w-100" :disabled="loading">{{ loading ? 'Creating...' : 'Create Account' }}</button>
          </form>
          <p class="text-center text-muted mt-3 mb-0">Already have an account? <a href="#" class="light-blue-text" @click.prevent="$emit('switchToLogin')">Log in</a></p>
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
  name: 'RegisterModal',
  emits: ['switchToLogin', 'success'],
  setup(props, { emit, expose }) {
    const { register } = useAuth()
    const modalRef = ref(null)
    const loading = ref(false)
    let modalInstance = null
    const form = ref({ firstName: '', lastName: '', email: '', password: '' })

    onMounted(() => { if (modalRef.value) modalInstance = new Modal(modalRef.value) })

    const handleSubmit = async () => {
      loading.value = true
      const result = await register(form.value)
      loading.value = false
      if (result.success) { modalInstance?.hide(); form.value = { firstName: '', lastName: '', email: '', password: '' }; emit('success') }
    }

    const show = () => modalInstance?.show()
    const hide = () => modalInstance?.hide()
    expose({ show, hide })

    return { modalRef, form, loading, handleSubmit }
  }
}
</script>

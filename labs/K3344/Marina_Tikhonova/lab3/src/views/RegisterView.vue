<template>
  <div class="register-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <RegisterForm @register="onRegister" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterForm from '../components/RegisterForm.vue'

export default {
  name: 'RegisterView',
  components: {
    RegisterForm
  },
  methods: {
    onRegister() {
      // Дополнительная логика после регистрации
    }
  }
}
</script>
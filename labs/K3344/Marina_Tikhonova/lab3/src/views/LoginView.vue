<template>
  <div class="login-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <LoginForm @login="onLogin" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue'

export default {
  name: 'LoginView',
  components: {
    LoginForm
  },
  methods: {
    onLogin() {
      // Дополнительная логика после входа
    }
  }
}
</script>
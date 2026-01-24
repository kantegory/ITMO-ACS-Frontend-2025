<template>
  <div>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-body">
              <h3 class="card-title mb-4">Вход</h3>
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input v-model="email" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Пароль</label>
                  <input v-model="password" type="password" class="form-control" required>
                </div>
                <div class="mb-3 form-check">
                  <input v-model="remember" type="checkbox" class="form-check-input">
                  <label class="form-check-label">Запомнить меня</label>
                </div>
                <button type="submit" class="btn btn-primary w-100">Войти</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { useAuth } from '../composables/useAuth';

export default {
  components: { Navbar, Footer },
  data() {
    return { email: '', password: '', remember: false };
  },
  setup() {
    return { auth: useAuth() };
  },
  methods: {
    async handleLogin() {
      const success = await this.auth.login({
        email: this.email,
        password: this.password,
        remember: this.remember
      });
      if (success) this.$router.push('/');
      else alert('Ошибка входа');
    }
  }
};
</script>

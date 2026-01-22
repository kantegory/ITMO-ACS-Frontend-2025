<template>
  <div>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-body">
              <h3 class="card-title mb-4">Регистрация</h3>
              <form @submit.prevent="handleRegister">
                <div class="mb-3">
                  <label class="form-label">Полное имя</label>
                  <input v-model="fullname" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input v-model="email" type="email" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Телефон</label>
                  <input v-model="phone" type="tel" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Город</label>
                  <select v-model="city" class="form-select" required>
                    <option disabled value="">Выберите город</option>
                    <option>Москва</option>
                    <option>Санкт-Петербург</option>
                    <option>Екатеринбург</option>
                    <option>Новосибирск</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Пароль</label>
                  <input v-model="password" type="password" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Подтвердите пароль</label>
                  <input v-model="confirmPassword" type="password" class="form-control" required>
                </div>
                <div class="mb-3 form-check">
                  <input v-model="agree" type="checkbox" class="form-check-input" required>
                  <label class="form-check-label">
                    Я согласен с <a href="#">правилами сервиса</a>
                  </label>
                </div>
                <div class="mb-3 form-check">
                  <input v-model="remember" type="checkbox" class="form-check-input">
                  <label class="form-check-label">Запомнить меня</label>
                </div>
                <button type="submit" class="btn btn-primary w-100">Зарегистрироваться</button>
              </form>
              <hr>
              <div class="text-center">
                Уже есть аккаунт? <router-link to="/login">Войти</router-link>
              </div>
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
import axios from 'axios';
import { useAuth } from '../composables/useAuth';

export default {
  components: { Navbar, Footer },
  data() {
    return {
      fullname: '',
      email: '',
      phone: '',
      city: '',
      password: '',
      confirmPassword: '',
      agree: false,
      remember: false
    };
  },
  setup() {
    const auth = useAuth();
    return { auth };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert('Пароли не совпадают');
        return;
      }
      try {
        const res = await axios.post('http://localhost:8000/auth/register', {
          email: this.email,
          fullname: this.fullname,
          phone: this.phone,
          city: this.city,
          password: this.password
        });

        // После регистрации сразу логиним пользователя
        const loginSuccess = await this.auth.login({
          email: this.email,
          password: this.password,
          remember: this.remember
        });

        if (loginSuccess) {
          alert('Регистрация и вход успешны!');
          this.$router.push('/');
        } else {
          alert('Ошибка при автоматическом входе');
        }

      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Сетевая ошибка');
      }
    }
  }
};
</script>

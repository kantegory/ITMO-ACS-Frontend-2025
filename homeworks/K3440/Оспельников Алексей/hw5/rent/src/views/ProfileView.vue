<template>
  <div>
    <div class="container mt-4" v-if="user">
      <div class="row">
        <div class="col-md-3">
          <div class="card shadow-sm mb-4 text-center">
            <div class="card-body">
              <img src="https://via.placeholder.com/100" class="rounded-circle mb-3" alt="Аватар">
              <h5>{{ user.fullname }}</h5>
              <p class="text-muted">Пользователь с {{ user.registeredAt }}</p>
              <div class="d-grid gap-2">
                <button class="btn btn-outline-danger btn-sm" @click="editProfile">Редактировать профиль</button>
                <button class="btn btn-outline-danger btn-sm" @click="handleLogout">Выйти</button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-9">
          <div class="card shadow-sm">
            <div class="card-header">
              <h5>Информация о пользователе</h5>
            </div>
            <div class="card-body">
              <p><strong>Email:</strong> {{ user.email }}</p>
              <p><strong>Телефон:</strong> {{ user.phone }}</p>
              <p><strong>Город:</strong> {{ user.city }}</p>
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
import axios from 'axios';

export default {
  components: { Navbar, Footer },
  data() {
    return {
      user: null
    };
  },
  setup() {
    const auth = useAuth();
    return { auth };
  },
  async mounted() {
    if (!this.auth.isLoggedIn()) {
      this.$router.push('/login');
      return;
    }
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.user = res.data;
    } catch (err) {
      console.error(err);
      alert('Не удалось загрузить данные профиля');
    }
  },
  methods: {
    handleLogout() {
      this.auth.logout();
      this.$router.push('/');
    },
    editProfile() {
      alert('Функция редактирования пока не реализована');
    }
  }
};
</script>

<script setup>
    import { ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import useUserStore from '@/stores/user'
    import LoginCard from '@/components/LoginCard.vue';
    import RegisterCard from '@/components/RegisterCard.vue';
    
    const router = useRouter();
    const currentForm = ref('login');
    const isLoading = ref(false);
    const errorMessage = ref('');

    const userStore = useUserStore()

    watch(currentForm, () => {
        errorMessage.value = '';
    });
    
    const onLogin = async (formData) => {
      isLoading.value = true;
      console.log('Попытка входа с данными:', formData);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Авторизация')
        await userStore.getToken(formData)
        await userStore.getUserByEmail(formData)
        router.push('/characters');
      } catch (error) {
        errorMessage.value = "Неверный логин или пароль"
      } finally {
        isLoading.value = false;
      }
    };
    
    const onRegister = async (formData) => {
      isLoading.value = true;
      console.log('Регистрация нового пользователя:', formData);
    
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Регистрация')
        userStore.createUser(formData)
        onLogin(formData)
      } catch (error) {
        alert('Не удалось зарегистрироваться. Возможно, логин уже занят.');
      } finally {
        isLoading.value = false;
      }
    };
    </script>
    
    <template>
      <div class="auth-page">
        <div v-if="isLoading" class="loader-overlay">
            <p>Обработка данных...</p>
        </div>
          <LoginCard 
            v-if="currentForm === 'login'"
            :errorMessage="errorMessage"
            @to-register="currentForm = 'register'"
            @login="onLogin"
          />
          <RegisterCard 
            v-else 
            @to-login="currentForm = 'login'"
            @register="onRegister"
          />
      </div>
    </template>
    
    <style scoped>
    .auth-page {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #222831;
      position: relative;
    }
    
    .loader-overlay {
      position: absolute;
      top: 20px;
      color: #d4c183;
      font-weight: bold;
    }
    
    .fade-enter-active, .fade-leave-active {
      transition: opacity 0.3s ease;
    }
    .fade-enter-from, .fade-leave-to {
      opacity: 0;
    }
    </style>
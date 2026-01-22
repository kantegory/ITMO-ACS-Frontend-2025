<script setup>
    import { onMounted, ref } from 'vue';
    
    const emit = defineEmits(['login', 'to-register']);
    
    const email = ref('');
    const password = ref('');
    const rememberMe = ref(false);
    
    const props = defineProps({
        errorMessage: String
    });
    
    const handleLogin = () => {
      emit('login', { email: email.value, password: password.value });
    };
    </script>
    
    <template>
      <div class="auth-card">
        <div class="auth-card__header">
          <h2>Вход в систему</h2>
        </div>
        
        <form @submit.prevent="handleLogin" class="auth-card__body">
          <div class="form-group">
            <label>Логин или Email</label>
            <input v-model="email" type="text" placeholder="Введите вашу почту" required />
          </div>
          
          <div class="form-group">
            <label>Пароль</label>
            <input v-model="password" type="password" placeholder="Введите ваш пароль" required />
          </div>

          <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
    
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="rememberMe" />
              <span>Запомнить меня</span>
            </label>
          </div>
    
          <button type="submit" class="auth-btn">Войти</button>
          
          <a href="#" class="forgot-link">Забыли пароль?</a>
          
          <div class="auth-card__footer">
            <span>Нет аккаунта? </span>
            <button type="button" class="link-btn" @click="$emit('to-register')">Зарегистрироваться</button>
          </div>
        </form>
      </div>
    </template>
    
    <style scoped>
    .auth-card {
      background: white;
      border-radius: 8px;
      width: 100%;
      max-width: 400px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    
    .auth-card__header {
      background: #d4c183;
      padding: 15px;
      text-align: center;
    }
    
    .auth-card__header h2 {
      margin: 0;
      font-size: 20px;
      color: #1a1a1a;
    }
    
    .auth-card__body {
      padding: 30px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-group label {
      font-size: 14px;
      color: #333;
    }
    
    .form-group input {
      padding: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      background: #fff;
    }
    
    .form-options {
      font-size: 14px;
      color: #555;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    
    .auth-btn {
      background: #d4c183;
      border: none;
      padding: 12px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      color: #1a1a1a;
      transition: opacity 0.2s;
    }
    
    .auth-btn:hover { opacity: 0.9; }
    
    .forgot-link {
      text-align: center;
      color: #1a73e8;
      text-decoration: none;
      font-size: 14px;
    }
    
    .auth-card__footer {
      border-top: 1px solid #eee;
      padding-top: 15px;
      text-align: center;
      font-size: 14px;
    }
    
    .link-btn {
      background: none;
      border: none;
      color: #1a73e8;
      cursor: pointer;
      padding: 0;
      font-size: inherit;
    }

    .error-text {
        color: #ff4d4d;
        font-size: 12px;
        margin-top: 4px;
    }

    .input-error {
        border-color: #ff4d4d !important;
    }
</style>
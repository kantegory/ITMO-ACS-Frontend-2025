<script setup>
    import { ref } from 'vue';
    
    const emit = defineEmits(['register', 'to-login']);
    
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const errorMessage = ref('');
    
    const handleRegister = () => {
        if (password.value !== confirmPassword.value) {
            errorMessage.value = "Пароли не совпадают!";
            return;
        }
      emit('register', { name: name.value, email: email.value, password: password.value });
    };
    </script>
    
    <template>
      <div class="auth-card">
        <div class="auth-card__header">
          <h2>Регистрация</h2>
        </div>
        
        <form @submit.prevent="handleRegister" class="auth-card__body">
          <div class="form-group">
            <label>Логин</label>
            <input v-model="name" type="text" placeholder="Придумайте логин" required />
          </div>
    
          <div class="form-group">
            <label>Email</label>
            <input v-model="email" type="email" placeholder="Введите ваш email" required />
          </div>
          
          <div class="form-group">
            <label>Пароль</label>
            <input v-model="password" type="password" placeholder="Придумайте пароль" required />
            <small class="hint">Пароль должен содержать не менее 8 символов</small>
          </div>
    
          <div class="form-group">
            <label>Повторите пароль</label>
            <input v-model="confirmPassword" type="password" placeholder="Повторите пароль" required />
          </div>
          <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
    
          <button type="submit" class="auth-btn">Зарегистрироваться</button>
          
          <div class="auth-card__footer">
            <span>Уже есть аккаунт? </span>
            <button type="button" class="link-btn" @click="$emit('to-login')">Авторизоваться</button>
          </div>
        </form>
      </div>
    </template>
    
    <style scoped>
    /* Стили идентичны LoginCard, добавим только специфичные */
    .hint {
      font-size: 12px;
      color: #888;
      margin-top: -4px;
    }
    /* ... (скопировать стили из LoginCard) ... */
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
<script setup>
    import { ref } from 'vue';
    
    const props = defineProps({
      isOpen: Boolean,
      userName: String,
      userEmail: String
    });
    
    const emit = defineEmits(['close', 'save']);
    
    const name = ref(props.userName);
    const email = ref(props.userEmail);
    const password = ref('');
    
    const close = () => {
      name.value = props.userName;
      email.value = props.userEmail;
      password.value = '';
      emit('close');
    }
    
    const submitForm = () => {
      emit('save', {
        name: name.value,
        email: email.value,
        password: password.value
      });
      close();
    };
</script>
    
<template>
      <Teleport to="body">
        <div v-if="isOpen" class="modal-overlay" @click.self="close">
          <div class="modal-window">
            <h3>Редактирование профиля</h3>
            
            <form @submit.prevent="submitForm" class="profile-form">
              <div class="form-group">
                <label>Имя</label>
                <input v-model="name" type="text" placeholder="Введите имя" required />
              </div>
              
              <div class="form-group">
                <label>Email</label>
                <input v-model="email" type="email" placeholder="example@mail.com" required />
              </div>
              
              <div class="form-group">
                <label>Новый пароль</label>
                <input v-model="password" type="password" placeholder="********" />
              </div>
    
              <div class="form-actions">
                <button type="button" class="btn-cancel" @click="close">Отмена</button>
                <button type="submit" class="btn-save">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>
</template>
    
<style scoped>
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .modal-window {
      background: white;
      padding: 30px;
      border-radius: 12px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    
    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-top: 20px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .form-group label {
      font-size: 14px;
      color: #555;
      font-weight: 500;
    }
    
    .form-group input {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 10px;
    }
    
    .btn-cancel {
      background: transparent;
      border: none;
      color: #666;
      cursor: pointer;
      padding: 10px;
    }
    
    .btn-save {
      background: #1a73e8;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .btn-save:hover {
      background: #1557b0;
    }
</style>
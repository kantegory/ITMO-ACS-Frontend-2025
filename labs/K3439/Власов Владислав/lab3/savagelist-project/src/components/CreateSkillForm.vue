<script setup>
  import { reactive } from 'vue';
  // Убедись, что путь к composable верный
  import useFormReset from '@/composables/useFormReset'

  const emit = defineEmits(['cancel', 'create']);

  const { resetFields } = useFormReset();

  const formData = reactive({
    name: '',
    description: '',
    attribute: '' // Это поле будет заполняться из select
  })

  const submitForm = () => {
    if (!formData.name || !formData.attribute) return; // Добавил проверку на заполненность атрибута
    emit('create', formData);
    resetFields(formData)
    console.log(formData);
  };
</script>

<template>
  <div class="skill-form-card">
    <div class="card-header">
      <h2>Новый навык</h2>
    </div>
    
    <form @submit.prevent="submitForm" class="form-body">
      <div class="form-group">
        <label>Название</label>
        <input 
          v-model="formData.name" 
          type="text" 
          placeholder="Наименование" 
          required 
          autofocus
        />
      </div>

      <div class="form-group">
        <label>Атрибут</label>
        <select v-model="formData.attribute" required>
          <option value="" disabled selected>Выберите атрибут</option>
          <option value="agility">Ловкость (Agility)</option>
          <option value="smarts">Смекалка (Smarts)</option>
          <option value="spirit">Характер (Spirit)</option>
          <option value="strenght">Сила (Strength)</option>
          <option value="vigor">Выносливость (Vigor)</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Описание</label>
        <textarea 
          v-model="formData.description" 
          placeholder="Зона ответственности навыка"
          rows="5"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="$emit('cancel')">Отмена</button>
        <button type="submit" class="btn-create">Создать</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
  .skill-form-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      width: 100%;
      max-width: 450px;
      top: 20px; /* Если используется absolute/fixed, иначе можно margin-top */
  }

  .card-header {
      background-color: #dccc94;
      padding: 15px 20px;
      text-align: center;
  }

  .card-header h2 {
      margin: 0;
      color: #2c2c2c;
      font-family: "Times New Roman", Times, serif;
      font-size: 1.3rem;
  }

  .form-body {
      padding: 25px;
  }

  .form-group {
      margin-bottom: 20px;
      text-align: left;
  }

  .form-group label {
      display: block;
      margin-bottom: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      color: #333;
  }

  /* Добавил .form-group select сюда, чтобы стиль был единым */
  .form-group input,
  .form-group textarea,
  .form-group select {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 1rem;
      font-family: inherit;
      box-sizing: border-box;
      transition: border-color 0.3s ease;
      background-color: #fff; /* Важно для select */
  }

  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
      outline: none;
      border-color: #dccc94;
  }

  ::placeholder {
      color: #bcbcbc;
      font-weight: 300;
  }

  .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 25px;
  }

  .btn-create {
      flex: 2;
      background: #dccc94;
      border: none;
      color: #2c2c2c;
      padding: 14px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
      transition: background 0.2s;
  }

  .btn-create:hover {
      background: #cbb87a;
  }

  .btn-cancel {
      flex: 1;
      background: transparent;
      border: 1px solid #e0e0e0;
      color: #757575;
      padding: 14px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
  }
  .btn-cancel:hover {
      background: #f9f9f9;
      color: #333;
  }
</style>
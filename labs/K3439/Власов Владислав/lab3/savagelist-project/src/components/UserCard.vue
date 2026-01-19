<script setup>
    // Временно используем пропсы вместо Pinia
    const props = defineProps({
      userName: { type: String},
      userEmail: { type: String}
    });
    
    const emit = defineEmits(['open-edit']);
</script>
    
<template>
    <div class="user-card">
    <div class="user-info">
        <h2 class="user-info__name">{{ userName }}</h2>
        <p class="user-info__email">{{ userEmail }}</p>
    </div>
    
    <button class="edit-btn" @click="emit('open-edit')">
        Редактировать профиль
    </button>
    </div>
</template>
    
<style scoped>
    .user-card {
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 30px 20px;
      max-width: 500px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 25px;
      box-sizing: border-box;
    }
    
    .user-info {
      text-align: center;
    }
    
    .user-info__name {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #000;
    }
    
    .user-info__email {
      margin: 8px 0 0 0;
      font-size: 16px;
      color: #666;
    }
    
    .edit-btn {
      width: 100%;
      max-width: 320px;
      background: transparent;
      border: 1px solid #1a73e8;
      color: #1a73e8;
      padding: 10px 0;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .edit-btn:hover {
      background-color: rgba(26, 115, 232, 0.04);
    }
</style>
<script setup>
    defineProps({
      title: String,
      description: String
    });
    defineEmits(['hide']);
</script>
    
<template>
    <div class="skill-detail-card">
        <div class="card-header">
            <h2>{{ title }}</h2>
        </div>
        
        <div class="card-body">
            <p class="description">
              {{ description }}
            </p>
        </div>

            <button class="hide-btn" @click="$emit('hide')">Скрыть</button>
    </div>
</template>
    
<style scoped>
  .skill-detail-card {
    background: white;
    border-radius: 6px; 
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 20px;
    padding: 0; 
    overflow: hidden;
    border: none;
  }

  .card-header {
    background-color: #dccc94;
    padding: 15px 20px;
    text-align: center;
    border-bottom: 1px solid #cfc08a;
  }


  h2 {
    margin: 0;
    color: #2c2c2c;
    font-family: "Times New Roman", Times, serif;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .card-body {
    padding: 25px;
  }

  .description {
    line-height: 1.6;
    color: #333;
    margin-bottom: 25px;
    margin-top: 0;
  }

  .hide-btn {
    background: #dccc94;
    border: none;
    color: #2c2c2c;
    padding: 12px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    width: 100%;
    transition: background 0.2s;
    font-family: inherit;
  }

  .hide-btn:hover {
    background: #cbb87a;
  }
    
</style>
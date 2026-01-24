<script setup>
    import BaseLayout from '@/layouts/BaseLayout.vue';
    import { useRoute } from 'vue-router';
    import { computed } from 'vue';
    
    const route = useRoute();
    const pageName = computed(() => {
        return route.path.replace('/', '').toUpperCase()
    });
</script>
    
<template>
      <BaseLayout>
        <div class="placeholder">
          <div class="placeholder__content">
            <h1 class="placeholder__title">Раздел «{{ pageName }}»</h1>
            <p class="placeholder__text">Эта страница сейчас находится в разработке.</p>
          </div>
        </div>
      </BaseLayout>
</template>
    
<style scoped>
    .placeholder {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      text-align: center;
    }
    
    .placeholder__content {
      background: white;
      padding: 3rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }
    
    .placeholder__text {
      color: #7f8c8d;
      margin-bottom: 1.5rem;
    }
</style>
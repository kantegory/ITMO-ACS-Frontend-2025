<template>
  <footer class="py-4 bg-dark text-light" role="contentinfo">
    <div class="container d-flex flex-wrap justify-content-between align-items-center gap-2">
      <span>&copy; 2025 JobFinder. Все права защищены.</span>
      <nav aria-label="Дополнительная навигация">
        <div class="d-flex gap-3 small">
          <a href="#" class="link-light text-decoration-none">О сервисе</a>
          <a href="#" class="link-light text-decoration-none">Поддержка</a>
          <a href="#" class="link-light text-decoration-none" @click.prevent="showFeedbackModal = true">
            Обратная связь
          </a>
        </div>
      </nav>
    </div>
    
    <FeedbackModal v-if="showFeedbackModal" @close="showFeedbackModal = false" />
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import FeedbackModal from './FeedbackModal.vue'

const showFeedbackModal = ref(false)
</script>


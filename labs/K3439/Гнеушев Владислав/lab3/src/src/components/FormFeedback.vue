<template>
  <div 
    v-if="message" 
    class="form-feedback mt-2" 
    :class="type === 'error' ? 'text-danger' : 'text-success'"
    role="alert" 
    aria-live="polite" 
    aria-atomic="true"
  >
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'error'
  }
});
</script>

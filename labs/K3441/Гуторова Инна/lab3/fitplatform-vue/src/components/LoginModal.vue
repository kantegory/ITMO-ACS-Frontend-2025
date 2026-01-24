<script setup>
defineProps({
  modelValue: Boolean,
  email: String,
  password: String,
  error: String
})
defineEmits(['update:modelValue', 'submit', 'update:email', 'update:password'])
</script>

<template>
  <div v-if="modelValue" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <form class="modal-content" @submit.prevent="$emit('submit')">
        <div class="modal-header">
          <h5 class="modal-title">Вход</h5>
          <button type="button" class="btn-close" @click="$emit('update:modelValue', false)"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" :value="email" @input="$emit('update:email', $event.target.value)" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Пароль</label>
            <input type="password" class="form-control" :value="password" @input="$emit('update:password', $event.target.value)" required />
          </div>
          <div v-if="error" class="text-danger">{{ error }}</div>
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <slot name="switch"> </slot>
          <button type="submit" class="btn btn-primary">Войти</button>
        </div>
      </form>
    </div>
  </div>
</template>

<template>
  <div class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="submit">
        <div class="modal-header">
          <h5 class="modal-title">Запланировать тренировку</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <label class="form-label">Выберите дату</label>
          <input type="date" class="form-control" v-model="date" required />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Отмена</button>
          <button type="submit" class="btn btn-success">Добавить в план</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  initialDate: { type: String, default: new Date().toISOString().split('T')[0] }
})

const emit = defineEmits(['close', 'submit'])

const date = ref(props.initialDate)

function submit() {
  emit('submit', date.value)
}
</script>

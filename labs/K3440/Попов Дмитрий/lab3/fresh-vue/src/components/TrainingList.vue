<template>
  <div>
    <TrainingCard v-for="t in trainings" :key="t.id" :t="t" @details="onDetails"/>
    <div v-if="!trainings.length" class="small text-muted">Ничего не найдено.</div>
  </div>
</template>


<script setup>
import TrainingCard from './TrainingCard.vue'

const props = defineProps({trainings: Array})
const emit = defineEmits(['details'])

function onDetails(id) {
  emit('details', id)
}
</script>
<template>
  <div class="card p-3 mb-3">
    <div class="d-flex justify-content-between">
      <div>
        <strong>{{ t.title }}</strong>
        <div class="small text-muted">{{ t.level }} · {{ t.type }} · {{ t.duration }} мин</div>
      </div>
      <button class="btn btn-sm btn-primary" @click="$emit('details', t.id)">Подробнее</button>
    </div>
    <div class="small mt-2">{{ t.description || 'Описание будет добавлено позже.' }}</div>
  </div>
</template>


<script setup>
const props = defineProps({ t: Object })
</script>
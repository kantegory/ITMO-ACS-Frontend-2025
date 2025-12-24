<script setup>
defineProps({
  owner: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
});
</script>

<template>
  <div class="card mb-3">
    <div class="card-body">
      <h2 class="h6">Владелец</h2>

      <div v-if="loading" class="text-muted">Загрузка данных владельца…</div>
      <div v-else-if="error" class="text-danger">{{ error }}</div>

      <template v-else-if="owner">
        <p class="mb-1 fw-bold">
          {{ owner.firstName + " " + owner.lastName || owner.name || "Без имени" }}
        </p>
        <p class="mb-1 text-muted">
          {{ owner.typeLabel || "Частное лицо" }}
        </p>
        <p class="mb-2" v-if="owner.phone">
          {{ owner.phone }}
        </p>
        <p class="mb-2" v-else>
          <span class="text-muted">Телефон скрыт</span>
        </p>
        <button
          class="btn btn-primary w-100"
          data-bs-toggle="modal"
          data-bs-target="#contactModal"
        >
          Написать владельцу
        </button>
      </template>

      <template v-else>
        <div class="text-muted">Нет данных о владельце</div>
      </template>
    </div>
  </div>
</template>

<script setup>
const model = defineModel({ type: Object, required: true })
</script>

<template>
  <div class="card mt-3">
    <div class="card-body">
      <div class="row g-3">
        <div class="col-12 col-md-4">
          <label class="form-label">Город</label>
          <input class="form-control" v-model="model.city" placeholder="Москва, СПб..." />
        </div>

        <div class="col-12 col-md-4">
          <label class="form-label">Кухня</label>
          <select class="form-select" v-model="model.cuisine">
            <option value="">Все</option>
            <option value="italian">Итальянская</option>
            <option value="japanese">Японская</option>
            <option value="georgian">Грузинская</option>
          </select>
        </div>

        <div class="col-12 col-md-4">
          <label class="form-label">Цена</label>
          <select class="form-select" v-model="model.price">
            <option value="">Все</option>
            <option value="budget">₽</option>
            <option value="moderate">₽₽</option>
            <option value="expensive">₽₽₽</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

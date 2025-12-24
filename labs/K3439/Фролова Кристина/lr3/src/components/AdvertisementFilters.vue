<script setup>
import { reactive } from "vue";

const props = defineProps({
  modelValue: { type: Object, required: true },
});
const emit = defineEmits(["update:modelValue", "apply"]);

const local = reactive({ ...props.modelValue });

function applyFilters() {
  emit("update:modelValue", { ...local });
  emit("apply");
}
</script>

<template>
  <form class="row g-2 mb-4">
    <div class="col-md-4">
      <input
        v-model="local.location"
        class="form-control"
        placeholder="Город"
      />
    </div>

    <div class="col-md-3">
      <select v-model="local.livingType" class="form-select">
        <option value="">Тип жилья</option>
        <option value="ROOM">Комната</option>
        <option value="FLAT">Квартира</option>
        <option value="COUNTRY_HOUSE">Дом</option>
      </select>
    </div>

    <div class="col-md-2">
      <input
        v-model="local.priceFrom"
        type="number"
        class="form-control"
        placeholder="Цена от"
      />
    </div>

    <div class="col-md-2">
      <input
        v-model.number="local.priceTo"
        type="number"
        class="form-control"
        placeholder="Цена до"
      />
    </div>

    <div class="col-md-1 d-grid">
      <button
        type="button"
        class="btn btn-primary"
        @click="applyFilters"
      >
        Найти
      </button>
    </div>
  </form>
</template>

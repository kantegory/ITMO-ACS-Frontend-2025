<template>
  <div v-if="show" class="custom-modal">
    <div class="custom-modal-backdrop" @click="close"></div>

    <div class="modal-dialog">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Редактировать объект</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="save">
            <div class="mb-3">
              <label class="form-label">Название</label>
              <input v-model="form.title" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Описание</label>
              <textarea v-model="form.description" class="form-control" rows="3"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Цена (₽)</label>
              <input v-model.number="form.price" type="number" class="form-control" min="0" required />
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="close">Отмена</button>
              <button type="submit" class="btn btn-primary">Сохранить</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import { usePropertyStore } from "@/stores/propertyStore";

const props = defineProps({
  show: Boolean,
  property: Object
});

const emit = defineEmits(["update:show"]);

const propertyStore = usePropertyStore();

const form = reactive({
  title: "",
  description: "",
  price: 0,
});

watch(
    () => props.show,
    (value) => {
      if (value && props.property) {
        form.title = props.property.title || "";
        form.description = props.property.description || "";
        form.price = props.property.price || 0;
      }
    }
);

async function save() {
  try {
    await propertyStore.saveProperty(props.property.id, form);
    close();
  } catch (err) {
    console.error("Ошибка сохранения объекта:", err);
    alert(err.message || "Не удалось сохранить объект");
  }
}

function close() {
  emit("update:show", false);
}
</script>
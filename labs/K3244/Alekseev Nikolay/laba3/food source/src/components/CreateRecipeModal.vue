<template>
  <div v-if="open" class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg"  style="z-index: 1100 !important;" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Создать рецепт</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
        </div>

        <div class="modal-body">
          <div v-if="error" class="alert alert-danger py-2 mb-3">{{ error }}</div>

          <div class="row g-3">
            <div class="col-12">
              <label class="form-label">Название *</label>
              <input v-model="form.name" class="form-control" placeholder="Например: Chicken Alfredo" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Категория *</label>
              <input v-model="form.category" class="form-control" placeholder="Например: Chicken" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Кухня *</label>
              <input v-model="form.area" class="form-control" placeholder="Например: Italian" />
            </div>

            <div class="col-12">
              <label class="form-label">Фото (необязательно)</label>
              <input v-model="form.photo" class="form-control" placeholder="https://..." />
            </div>

            <div class="col-12">
              <label class="form-label">Ингредиенты *</label>
              <textarea
                v-model="form.ingredientsRaw"
                class="form-control"
                rows="3"
                placeholder="По одному ингредиенту на строке&#10;Например:&#10;Chicken breast&#10;Garlic&#10;Olive oil"
              />
              <div class="form-text">Минимум 1 ингредиент.</div>
            </div>

            <div class="col-12">
              <label class="form-label">Инструкция *</label>
              <textarea
                v-model="form.instructions"
                class="form-control"
                rows="6"
                placeholder="Опиши шаги приготовления..."
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="close" :disabled="saving">
            Отмена
          </button>
          <button type="button" class="btn btn-primary" @click="submit" :disabled="saving">
            {{ saving ? "Сохранение..." : "Создать" }}
          </button>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show" @click="close"></div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue"

const props = defineProps({
  open: { type: Boolean, default: false }
})

const emit = defineEmits(["close", "created"])

const saving = ref(false)
const error = ref("")

const form = reactive({
  name: "",
  category: "",
  area: "",
  photo: "",
  ingredientsRaw: "",
  instructions: ""
})

const ingredients = computed(() => {
  return String(form.ingredientsRaw || "")
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean)
})

watch(
  () => props.open,
  (v) => {
    if (v) error.value = ""
  }
)

function close() {
  if (saving.value) return
  emit("close")
}

function validate() {
  if (!form.name.trim()) return "Название обязательно"
  if (!form.category.trim()) return "Категория обязательна"
  if (!form.area.trim()) return "Кухня (Area) обязательна"
  if (ingredients.value.length === 0) return "Нужно указать хотя бы 1 ингредиент"
  if (!form.instructions.trim()) return "Инструкция обязательна"
  return ""
}

async function submit() {
  error.value = validate()
  if (error.value) return

  saving.value = true
  try {
    emit("created", {
      name: form.name.trim(),
      category: form.category.trim(),
      area: form.area.trim(),
      photo: form.photo.trim(),
      ingredients: ingredients.value,
      instructions: form.instructions.trim()
    })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <aside class="col-lg-3 mb-4" aria-label="Фильтры альбомов">
    <div class="card">
      <div class="card-body">
        <h2 class="card-title h5">Фильтры</h2>

        <div class="mb-4">
          <label class="form-label">
            <strong>Жанр</strong>
          </label>

          <div class="d-flex flex-column gap-2">
            <label
              v-for="g in genres"
              :key="g"
              class="form-check d-flex align-items-center gap-2 m-0"
            >
              <input
                class="form-check-input m-0"
                type="checkbox"
                :value="g"
                :checked="modelValue.selectedGenres.includes(g)"
                @change="toggleGenre(g)"
              />
              <span class="form-check-label">{{ g }}</span>
            </label>
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="yearFilter">
            <strong>Год релиза</strong>
          </label>

          <input
            id="yearFilter"
            type="range"
            class="form-range"
            :min="minYear"
            :max="maxYear"
            :value="modelValue.minYear"
            @input="setMinYear($event.target.value)"
          />

          <small class="text-muted">
            <span>{{ modelValue.minYear }}</span> по {{ maxYear }}
          </small>
        </div>

        <div class="mb-4">
          <label class="form-label" for="ratingFilter">
            <strong>Рейтинг</strong>
          </label>

          <input
            id="ratingFilter"
            type="range"
            class="form-range"
            min="0"
            max="10"
            step="0.5"
            :value="modelValue.minRating"
            @input="setMinRating($event.target.value)"
          />

          <small class="text-muted">
            от <span>{{ modelValue.minRating }}</span> до 10
          </small>
        </div>

        <button class="btn btn-warning w-100" type="button" @click="reset">
          Сбросить фильтры
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  genres: {
    type: Array,
    required: true,
  },
  minYear: {
    type: Number,
    required: true,
  },
  maxYear: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

function update(patch) {
  emit("update:modelValue", { ...props.modelValue, ...patch });
}

function toggleGenre(genre) {
  const set = new Set(props.modelValue.selectedGenres);
  if (set.has(genre)) set.delete(genre);
  else set.add(genre);
  update({ selectedGenres: [...set] });
}

function setMinYear(value) {
  update({ minYear: Number(value) });
}

function setMinRating(value) {
  update({ minRating: Number(value) });
}

function reset() {
  emit("update:modelValue", {
    selectedGenres: [],
    minYear: props.minYear,
    minRating: 0,
  });
}
</script>

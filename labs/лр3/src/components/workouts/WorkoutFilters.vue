<template>
  <div class="card glass-card mb-4">
    <div class="card-body">
      <h5 class="light-blue-text mb-3">Filter Workouts</h5>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">Difficulty Level</label>
          <select v-model="localFilters.level" class="form-select">
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Workout Type</label>
          <select v-model="localFilters.type" class="form-select">
            <option value="all">All Types</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="yoga">Yoga</option>
            <option value="stretching">Stretching</option>
            <option value="hiit">HIIT</option>
            <option value="power-lifting">Power Lifting</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Duration</label>
          <select v-model="localFilters.duration" class="form-select">
            <option value="all">All Durations</option>
            <option value="short">Short (20 min)</option>
            <option value="medium">Medium (30 min)</option>
            <option value="long">Long (45 min)</option>
          </select>
        </div>
        <div class="col-12 mt-3">
          <button class="btn btn-form-primary me-2" @click="applyFilters">Apply Filters</button>
          <button class="btn btn-outline-secondary" @click="resetFilters">Reset</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
export default {
  name: 'WorkoutFilters',
  props: { filters: { type: Object, default: () => ({ type: 'all', level: 'all', duration: 'all' }) } },
  emits: ['update:filters', 'apply', 'reset'],
  setup(props, { emit }) {
    const localFilters = ref({ ...props.filters })
    watch(() => props.filters, (n) => { localFilters.value = { ...n } }, { deep: true })
    const applyFilters = () => { emit('update:filters', { ...localFilters.value }); emit('apply') }
    const resetFilters = () => { localFilters.value = { type: 'all', level: 'all', duration: 'all' }; emit('update:filters', { ...localFilters.value }); emit('reset') }
    return { localFilters, applyFilters, resetFilters }
  }
}
</script>

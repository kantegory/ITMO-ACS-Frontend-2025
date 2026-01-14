<template>
  <div class="mt-4 pt-4 border-top">
    <h4 class="light-blue-text mb-4">Workout Instructions</h4>
    <div class="alert alert-info">
      <h5>General Instructions</h5>
      <ul class="mb-0">
        <li>Always start with a 5-10 minute warm-up</li>
        <li>Focus on proper form</li>
        <li>Stay hydrated</li>
        <li>Finish with a cool down</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkoutInstructions',
  props: { type: String, level: String }
}
</script>

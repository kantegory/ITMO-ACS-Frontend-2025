<script setup>
    const props = defineProps(["author", "text"])
</script>

<template>
  <div class="card w-100 mb-3" style="width: 18rem">
    <div class="card-body">
      <div class="d-flex mb-2">
        <h5 class="card-title">{{ props.author }}</h5>
      </div>
      <p class="card-text">{{ props.text }}</p>
    </div>
  </div>
</template>

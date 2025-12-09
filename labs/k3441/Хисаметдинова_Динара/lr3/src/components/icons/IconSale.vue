<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24">
    <circle cx="9" cy="9" r="1" stroke="currentColor" stroke-width="2" fill="none"/>
    <circle cx="15" cy="15" r="1" stroke="currentColor" stroke-width="2" fill="none"/>
    <path d="M8 16L16 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2" fill="none"/>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  width?: number | string
  height?: number | string
}

withDefaults(defineProps<Props>(), {
  width: 24,
  height: 24
})
</script>
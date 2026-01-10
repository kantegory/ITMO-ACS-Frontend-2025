<template>
  <svg 
    :class="iconClasses" 
    aria-hidden="true"
  >
    <use :href="iconHref"></use>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  extraClass: {
    type: String,
    default: ''
  }
})

const iconHref = computed(() => `/src/assets/icons.svg#icon-${props.name}`)

const iconClasses = computed(() => {
  const classes = ['icon', `icon-${props.size}`]
  if (props.extraClass) {
    classes.push(props.extraClass)
  }
  return classes.join(' ')
})
</script>

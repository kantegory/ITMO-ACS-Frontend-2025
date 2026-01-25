<template>
  <div v-if="svgLoaded" style="display: none;" v-html="svgContent"></div>
</template>

<script setup>
import {ref, onMounted} from 'vue'

const svgContent = ref('')
const svgLoaded = ref(false)

onMounted(async () => {
  try {
    const response = await fetch('/svg-sprites/sprites.svg')
    if (response.ok) {
      let svg = await response.text()
      svg = svg.replace(/<\?xml[^>]*\?>/g, '')
      svg = svg.replace(/display="none"/g, '')
      svgContent.value = svg
      svgLoaded.value = true
    } else {
      console.error('Ошибка загрузки SVG спрайтов:', response.status)
    }
  } catch (error) {
    console.error('Ошибка при загрузке SVG спрайтов:', error)
  }
})
</script>

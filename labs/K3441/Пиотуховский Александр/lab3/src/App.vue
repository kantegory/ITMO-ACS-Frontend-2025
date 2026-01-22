<template>
  <div id="app">
    <Navigation/>
    <RouterView/>
    <ToastContainer/>
  </div>
</template>

<script setup>
import {onMounted} from 'vue'
import {RouterView} from 'vue-router'
import Navigation from '@/components/layout/Navigation.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
import {useThemeStore} from '@/stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

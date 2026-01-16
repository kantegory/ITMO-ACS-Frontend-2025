<template>
    <div id="app">
        <HeaderComponent />
        <router-view />
        <FooterComponent />
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useTheme } from '@/composables/useTheme';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

const { init } = useAuth();
const { theme } = useTheme();
onMounted(async () => {
    await init();
});
</script>

<style scoped>
#app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
main {
    flex: 1;
}
</style>

<script setup>
const props = defineProps({
    text: {
        type: String,
        default: 'Загрузка...'
    }
})
</script>

<template>
<div class="loader-wrapper">
    <div class="loader">
        <span></span>
        <span></span>
        <span></span>
    </div>

    <p v-if="text" class="loader-text">{{ text }}</p>
</div>
</template>

<style scoped>

.loader-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-main);
    position: fixed;
    inset: 0;
    background: var(--bg-page);
    z-index: 9999;
}

.loader {
    display: flex;
    gap: 10px;
}

.loader span {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--green-accent);
    animation: bounce 1.4s infinite ease-in-out both;
}

.loader span:nth-child(1) { animation-delay: -0.32s; }
.loader span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
    0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
    40% { transform: scale(1); opacity: 1; }
}

.loader-text {
    margin-top: 16px;
    opacity: 0.8;
}
</style>

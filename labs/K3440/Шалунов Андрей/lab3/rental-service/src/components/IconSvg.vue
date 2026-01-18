<template>
    <svg class="icon" aria-hidden="true" focusable="false">
        <use :href="`/sprite.svg#icon-${name}`"></use>
    </svg>
</template>

<script setup>
defineProps({
    name: {
        type: String,
        required: true
    }
});
</script>
<template>
    <div>
        <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
            <div class="modal-dialog" :class="dialogClass">
                <div class="modal-content">
                    <slot />
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show"></div>
    </div>
</template>

<script setup>
defineProps({
    dialogClass: { type: String, default: "" }
});
</script>
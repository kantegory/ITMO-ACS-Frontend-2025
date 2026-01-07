<template>
    <div class="tag-row">
        <div class="row g-3 align-items-end">
            <div class="col-md-5">
                <label class="form-label">Тег*</label>
                <select
                    :value="modelValue.tagId"
                    @input="updateField('tagId', Number($event.target.value))"
                    class="form-select"
                    required
                    aria-required="true"
                    aria-label="Выберите тег"
                >
                    <option value="">Выберите</option>
                    <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                        {{ tag.name }}
                    </option>
                </select>
            </div>
            <div class="col-md-1 text-end">
                <button 
                    type="button" 
                    class="btn btn-outline-danger"
                    aria-label="Удалить тег из списка"
                    @click="$emit('remove')"
                >
                    &times;
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
    },
    tags: {
        type: Array,
        required: true,
    },
});
const emit = defineEmits(['update:modelValue', 'remove']);
function updateField(field, value) {
    emit('update:modelValue', { ...props.modelValue, [field]: value });
}
</script>
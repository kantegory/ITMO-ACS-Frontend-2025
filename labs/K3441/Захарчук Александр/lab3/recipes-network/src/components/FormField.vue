<script setup>
const props = defineProps([
  "type",
  "id",
  "label",
  "placeholder",
  "isRequired",
  "addBottomMargin",
  "modelValue",
]);

defineEmits(['update:modelValue']);
</script>

<template>
  <div :class="props.addBottomMargin ? 'mb-3' : ''">
    <label :for="props.id" class="form-label">{{ label }}</label>
    <input
      :value="props.modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="props.type"
      class="form-control"
      :id="props.id"
      :placeholder="props.placeholder"
      :required="props.isRequired"
    />
    <slot></slot>
  </div>
</template>

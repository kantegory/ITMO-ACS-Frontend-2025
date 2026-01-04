<script setup>
import { computed } from "vue";

const props = defineProps({
  item: { type: Object, required: true },
  kind: { type: String, default: "property" },
});

const to = computed(() => {
  if (props.kind === "renting") {
    const advId = props.item?.advertisementId;
    return advId ? `/advertisements/${advId}` : "/";
  }

  const id = props.item?.id;
  return id ? `/advertisements/${id}` : "/";
});
</script>

<template>
  <RouterLink :to="to" class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">{{ item.title }}</h5>
      <small :class="item.statusClass">{{ item.statusText }}</small>
    </div>
    <p class="mb-1">{{ item.address }}</p>
    <small>{{ item.details }}</small>
  </RouterLink>
</template>

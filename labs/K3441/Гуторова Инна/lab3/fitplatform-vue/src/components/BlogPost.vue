<template>
  <div class="blog-post card p-3 mb-4">
    <img :src="post.image" :alt="post.title" class="mb-3" />

    <h5>{{ post.title }}</h5>

    <div class="post-meta mb-2">
      Автор: <strong>{{ post.authorName }}</strong> ·
      {{ formattedDate }}
    </div>

    <p>
      {{ post.expanded ? post.text : post.shortText }}
    </p>

    <span
      v-if="post.isLong"
      class="read-more text-primary"
      role="button"
      @click="post.expanded = !post.expanded"
    >
      {{ post.expanded ? 'Скрыть' : 'Читать дальше' }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  post: Object
})

const formattedDate = computed(() =>
  new Date(props.post.date).toLocaleDateString('ru-RU')
)
</script>

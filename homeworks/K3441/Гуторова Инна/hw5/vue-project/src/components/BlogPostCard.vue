<template>
  <div class="card h-100 blog-post-card">
    <img
      v-if="image"
      :src="image"
      class="card-img-top"
      alt="post image"
    />

    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ title }}</h5>

      <small v-if="date" class="text-muted mb-2">
        {{ formattedDate }}
      </small>

      <p class="card-text">
        {{ expanded ? text : shortText }}
      </p>

      <span
        v-if="isLong"
        class="text-primary mt-auto"
        role="button"
        @click="expanded = !expanded"
      >
        {{ expanded ? 'Скрыть' : 'Читать дальше' }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogPostCard',

  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      expanded: false
    }
  },

  computed: {
    isLong() {
      return this.text.length > 200
    },

    shortText() {
      return this.text
        ? this.text.slice(0, 200) + '…'
        : ''
    },

    formattedDate() {
      return this.date
        ? new Date(this.date).toLocaleDateString('ru-RU')
        : ''
    }
  }
}
</script>

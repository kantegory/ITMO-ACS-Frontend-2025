<template>
  <div class="card h-100">
    <img :src="post.image" class="card-img-top" :alt="post.title">
    <div class="card-body">
      <h3 class="card-title blog-post-title">{{ post.title }}</h3>
      <p class="card-text text-muted">{{ post.text }}</p>
      <a href="#" class="btn btn-sm btn-outline-brand">Читать</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogPostCard',
  props: {
    post: {
      type: Object,
      required: true
    }
  }
}
</script>
<template>
  <div>
    <div class="mb-4">
      <h2 class="h3 fw-bold mb-2">
        <i class="bi bi-newspaper text-primary me-2"></i>Блог о Здоровье и Питании
      </h2>
      <p class="text-muted">Полезные статьи, советы и исследования для вашего фитнес-путешествия</p>
    </div>

    <div class="card p-3 mb-4">
      <div class="row g-2 align-items-end">
        <div class="col-md-4">
          <label class="form-label small mb-1">Категория</label>
          <select v-model="filters.category" class="form-select form-select-sm">
            <option value="">Все категории</option>
            <option value="nutrition">Питание</option>
            <option value="training">Тренировки</option>
            <option value="health">Здоровье</option>
            <option value="recovery">Восстановление</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label small mb-1">Поиск</label>
          <input
              v-model="filters.search"
              type="text"
              class="form-control form-control-sm"
              placeholder="Введите ключевое слово..."
          >
        </div>
        <div class="col-md-4">
          <button @click="applyFilters" class="btn btn-sm btn-primary w-100">
            <i class="bi bi-funnel me-1"></i>Применить
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center p-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
      <p class="mt-3 text-muted">Загрузка статей...</p>
    </div>

    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="post in posts" :key="post.id" class="col">
        <div class="card h-100 blog-card position-relative">
          <span :class="getBadgeClass(post.category)" class="badge badge-category">
            {{ getCategoryName(post.category) }}
          </span>
          <img
              :src="getPlaceholderImage(post.category)"
              class="card-img-top"
              :alt="post.title"
              style="height: 200px; object-fit: cover;"
          >
          <div class="card-body">
            <h5 class="card-title">{{ post.title }}</h5>
            <p class="card-text text-muted small">{{ post.excerpt || post.content.substring(0, 100) }}...</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <small class="text-muted">
                <i class="bi bi-calendar3 me-1"></i>{{ formatDate(post.date) }}
              </small>
              <button @click="openPost(post)" class="btn btn-sm btn-outline-primary">
                Читать <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="blogPostModal" tabindex="-1" ref="modalEl">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedPost?.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p class="lead">{{ selectedPost?.content }}</p>
            <hr>
            <p class="text-muted">
              <i class="bi bi-tag me-2"></i>{{ getCategoryName(selectedPost?.category) }}
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useBlog} from '../common/useBlog'
import {Modal} from 'bootstrap'

const {posts, loading, loadPosts} = useBlog()
const filters = ref({category: '', search: ''})
const selectedPost = ref(null)
const modalEl = ref(null)
let modalInstance = null

onMounted(() => {
  loadPosts()
  modalInstance = new Modal(modalEl.value)
})

const applyFilters = () => {
  loadPosts(filters.value)
}

const openPost = (post) => {
  selectedPost.value = post
  modalInstance.show()
}

const getCategoryName = (category) => {
  const names = {
    nutrition: 'Питание',
    training: 'Тренировки',
    health: 'Здоровье',
    recovery: 'Восстановление'
  }
  return names[category] || category
}

const getBadgeClass = (category) => {
  const classes = {
    nutrition: 'bg-success',
    training: 'bg-primary',
    health: 'bg-warning',
    recovery: 'bg-info'
  }
  return `${classes[category] || 'bg-secondary'} badge-category`
}

const getPlaceholderImage = (category) => {
  const colors = {
    nutrition: '1abc9c',
    training: '3498db',
    health: 'f39c12',
    recovery: '9b59b6'
  }
  const color = colors[category] || 'cccccc'
  return `https://placehold.co/600x400/${color}/ffffff?text=${getCategoryName(category)}`
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ru-RU')
}
</script>

<style scoped>
.blog-card {
  transition: transform .3s ease, box-shadow .3s ease;
  border: none;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, .08);
}

.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, .15);
}

.badge-category {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}
</style>
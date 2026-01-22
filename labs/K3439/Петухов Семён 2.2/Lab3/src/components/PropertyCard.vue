<template>
  <div class="col-md-6 col-lg-4 mb-4" role="listitem" :aria-label="`${property.title}, ${property.location}`">
    <div class="card card-custom h-100">
      <img :src="coverImage" class="property-img w-100" :alt="property.title">
      <div class="property-card-body">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="mb-1">{{ property.title }}</h6>
            <div class="property-meta">{{ property.location }} • {{ property.type }} • {{ property.beds }} спал. • {{ property.baths }} ван.</div>
          </div>
          <div class="text-end">
            <div class="h6 mb-1">₽{{ property.price }}/мес</div>
            <div class="badge-ghost">{{ statusText(property.status) }}</div>
          </div>
        </div>
        <p class="mt-2 mb-2 text-muted small">{{ description }}</p>
        <div class="d-flex justify-content-between">
          <button class="btn btn-sm btn-outline-primary view-btn" @click="viewProperty">Посмотреть</button>
          <button 
            class="btn btn-sm btn-primary book-btn" 
            :disabled="property.status !== 'available'"
            @click="bookProperty"
          >
            Забронировать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDataService } from '@/composables/useDataService'

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['book'])

const router = useRouter()
const { statusText } = useDataService()

const coverImage = computed(() => {
  return props.property.images && props.property.images.length 
    ? props.property.images[0] 
    : 'https://via.placeholder.com/600x400?text=No+image'
})

const description = computed(() => {
  const desc = props.property.description || ''
  return desc.slice(0, 90) + (desc.length > 90 ? '...' : '')
})

function viewProperty() {
  router.push(`/property/${props.property.id}`)
}

function bookProperty() {
  emit('book', props.property)
}
</script>


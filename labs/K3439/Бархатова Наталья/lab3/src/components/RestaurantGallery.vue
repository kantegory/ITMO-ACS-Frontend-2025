<template>
  <section aria-labelledby="gallery-title" class="mt-4">
    <h2 id="gallery-title" class="section-title">Фотографии ресторана</h2>
    <div class="row g-2">
      <div
        v-for="(src, index) in gallery"
        :key="index"
        class="col-md-4"
      >
        <img
          :src="src"
          class="gallery-img rounded"
          alt="Фото ресторана"
          @click="openImage(src)"
          role="img"
        />
      </div>
    </div>

    <div
      class="modal fade"
      id="imageModal"
      tabindex="-1"
      aria-labelledby="imageModalLabel"
      aria-hidden="true"
      ref="modal"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-body p-0">
            <img :src="selectedImage" class="w-100 rounded" alt="Просмотр фото" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'

const props = defineProps({
  gallery: {
    type: Array,
    default: () => []
  }
})

const selectedImage = ref('')
const modal = ref(null)
let bsModal = null

const openImage = (src) => {
  selectedImage.value = src
  if (!bsModal) {
    bsModal = new bootstrap.Modal(modal.value)
  }
  bsModal.show()
}

watch(() => props.gallery, () => {
  selectedImage.value = ''
})
</script>

<style scoped>
.gallery-img {
  cursor: pointer;
  width: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.2s;
}
.gallery-img:hover {
  transform: scale(1.05);
}
</style>

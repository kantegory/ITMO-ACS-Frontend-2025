<template>
  <div>
    <Navbar />
    <main class="container-lg my-4">
      <router-view />
    </main>
    <SuccessModal ref="successModal" />
    <TrainingDetailModal ref="trainingDetailModal" />
  </div>
</template>

<script>
import { ref, provide } from 'vue'
import Navbar from './components/Navbar.vue'
import SuccessModal from './components/SuccessModal.vue'
import TrainingDetailModal from './components/TrainingDetailModal.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    SuccessModal,
    TrainingDetailModal
  },
  setup() {
    const successModal = ref(null)
    const trainingDetailModal = ref(null)

    provide('successModal', successModal)
    provide('trainingDetailModal', trainingDetailModal)

    return {
      successModal,
      trainingDetailModal
    }
  }
}
</script>
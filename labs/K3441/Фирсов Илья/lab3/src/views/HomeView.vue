<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'

const router = useRouter()
const store = useJobsStore()

onMounted(async () => {
  await store.init()
  router.push('/jobs')
})
</script>

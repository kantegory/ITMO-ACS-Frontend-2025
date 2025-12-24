<template>
  <div class="row g-4">
    <aside class="col-md-4">
      <TrainingFilter @apply="applyFilters"/>
    </aside>
    <div class="col-md-8">
      <TrainingList :trainings="trainings" @details="openDetails"/>
    </div>


    <div class="modal fade" id="trainingDetailModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content p-3">
          <h5 id="modalTitle">{{ modalData?.title }}</h5>
          <p class="small text-muted">{{ modalData?.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import {ref} from 'vue'
import TrainingFilter from '../components/TrainingFilter.vue'
import TrainingList from '../components/TrainingList.vue'
import {useTrainings} from '../common/useTrainings'
import api from '../api/http'
import {Modal} from 'bootstrap'


const {trainings, loadTrainings} = useTrainings()
const modalData = ref(null)


function applyFilters(filters) {
  loadTrainings(filters)
}

async function openDetails(id) {
  const {data} = await api.get('/trainings', {params: {id}})
  modalData.value = data[0]
  const modalEl = document.getElementById('trainingDetailModal')
  new Modal(modalEl).show()
}

loadTrainings()
</script>
import {ref} from 'vue'
import api from '../api/http'

export function useTrainings() {
    const trainings = ref([])
    const loading = ref(false)


    const loadTrainings = async (filters = {}) => {
        loading.value = true
        try {
            const params = {}
            if (filters.level) params.level = filters.level
            if (filters.type) params.type = filters.type
            if (filters.maxDuration) params.duration_lte = filters.maxDuration
            const {data} = await api.get('/trainings', {params})
            trainings.value = data
        } finally {
            loading.value = false
        }
    }


    return {trainings, loading, loadTrainings}
}
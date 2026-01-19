
import { defineStore } from 'pinia'
import { skillsApi } from '@/api'

const useSkillsStore = defineStore('skills', {
  state: () => ({
    skills: [],
    lastUpdated: null,
    ttl: 15 * 60 * 1000
  }),

  getters: {
    skillsCount: (state) => state.skills.length,
  },

  actions: {

    async getSkills(token) {

      const now = Date.now()

      if (this.skills.length > 0 && this.lastUpdated && (now - this.lastUpdated < this.ttl)) {
        console.log('Навыки уже есть в сторе, пропускаем загрузку');
        return; 
      }

      const response = await skillsApi.getSkills(token)

      console.log(response.data)

      this.skills = response.data

      this.lastUpdated = Date.now();
    },

    async createSkill(data, token) {
      console.log(`Привет из хранилища`)

      const response = await skillsApi.createSkill(data, token)
      
      console.log(response.data)

      this.skills.push(response.data)
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'skill-store', 
        storage: localStorage,
      }
  ]}

})

export default useSkillsStore
import { defineStore } from 'pinia'
import { notesApi } from '@/api'

const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: []
  }),

  actions: {
    async loadNotes() {
      console.log('[notesStore] loadNotes()')
      const response = await notesApi.getAll()

      this.notes = response.data

      return response
    },

    async createNote(data) {
      console.log('[notesStore] createNote()', data)
      try {
        const response = await notesApi.createNote(data)
        // после успешного создания заново подгружаем список заметок
        await this.loadNotes()
        console.log('[notesStore] createNote() success', response.data)
        return response
      } catch (error) {
        // чтобы легче было отладить проблему создания
        console.error('Ошибка при создании заметки', error)
        throw error
      }
    }
  }
})

export default useNotesStore

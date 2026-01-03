<template>
  <base-layout>
    <h1>Notes app</h1>

    <form
      ref="noteForm"
      @submit.prevent="createCard"
      class="d-flex flex-column my-5"
    >
      <input
        type="text"
        v-model="form.name"
        placeholder="Заголовок"
        class="my-1"
      />
      <textarea
        cols="30"
        rows="10"
        v-model="form.text"
        placeholder="Текст заметки"
        class="my-1"
      ></textarea>

      <button
        type="submit"
        class="btn btn-primary"
      >
        Отправить
      </button>
    </form>

    <div class="row row-cols-1 row-cols-md-2 g-4 mt-5" id="notes">
      <div class="col" v-for="note in notes" :key="note.id">
        <note-card :name="note.name" :text="note.text" />
      </div>
    </div>
  </base-layout>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import BaseLayout from '@/layouts/BaseLayout.vue'
import NoteCard from '@/components/NoteCard.vue'
import useNotesStore from '@/stores/notes'

export default {
  name: 'NotesPage',
  components: { BaseLayout, NoteCard },

  data() {
    return {
      form: {
        name: '',
        text: '',
        userId: 1
      }
    }
  },

  computed: {
    ...mapState(useNotesStore, ['notes'])
  },

  methods: {
    ...mapActions(useNotesStore, ['loadNotes', 'createNote']),

    async createCard() {
      if (!this.form.name.trim()) {
        alert('Введите заголовок заметки')
        return
      }

      try {
        await this.createNote(this.form)
        await this.loadNotes()
        this.$refs.noteForm.reset()
        this.form.name = ''
        this.form.text = ''
      } catch (error) {
        console.error('Ошибка создания заметки:', error)
        alert('Не удалось создать заметку')
      }
    }
  },

  mounted() {
    this.loadNotes()
  }
}
</script>
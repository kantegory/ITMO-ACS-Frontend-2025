<template>
  <div v-if="visible" class="modal-backdrop-custom">
    <div class="modal-card">
      <h5 class="mb-3">Добавить пост</h5>

      <form @submit.prevent="submit">
        <input
          type="text"
          class="form-control mb-2"
          placeholder="Заголовок"
          v-model="form.title"
          required
        />

        <textarea
          class="form-control mb-3"
          rows="5"
          placeholder="Текст поста"
          v-model="form.text"
        />

        <div class="d-flex justify-content-end gap-2">
          <button
            type="button"
            class="btn btn-secondary"
            @click="close"
          >
            Отмена
          </button>

          <button
            type="submit"
            class="btn btn-primary"
          >
            Добавить
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddPostModal',

  data() {
    return {
      visible: false,
      form: {
        title: '',
        text: ''
      }
    }
  },

  methods: {
    open() {
      this.visible = true
    },

    close() {
      this.visible = false
      this.form.title = ''
      this.form.text = ''
    },

    submit() {
    this.$emit('submit', {
      title: this.form.title,
      text: this.form.text
    })
    this.close()
  }
  }
}
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-card {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
}
</style>

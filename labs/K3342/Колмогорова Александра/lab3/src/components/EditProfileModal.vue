<template>
  <div class="modal fade" id="editProfileModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Редактирование профиля</h5>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Имя и фамилия</label>
            <input v-model="name" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Имя пользователя</label>
            <div class="input-group">
              <span class="input-group-text">@</span>
              <input v-model="username" class="form-control" />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">О себе</label>
            <textarea v-model="bio" class="form-control" rows="3" />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
          <button
            class="btn btn-success"
            data-bs-dismiss="modal"
            @click="save()">
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  user: Object
})

const emit = defineEmits(['save'])

const name = ref('')
const username = ref('')
const bio = ref('')

watch(
  () => props.user,
  (u) => {
    name.value = u?.name || ''
    username.value = u?.username || ''
    bio.value = u?.bio || ''
  },
  { immediate: true }
)

function save() {
  emit('save', {
    name: name.value,
    username: username.value,
    bio: bio.value
  })
}
</script>

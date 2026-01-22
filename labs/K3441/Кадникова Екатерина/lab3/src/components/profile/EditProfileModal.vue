<template>
  <div v-if="show" class="custom-modal-wrapper edit-profile-modal">
    <div class="custom-modal-backdrop" @click="close"></div>
    <div class="custom-modal-dialog">
      <div class="modal-window">
        <h4>Редактировать профиль</h4>

        <form @submit.prevent="save">
          <div class="mb-3">
            <label class="form-label">Имя пользователя</label>
            <input v-model="form.username" type="text" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" />
          </div>

          <div class="text-end">
            <button class="btn btn-secondary me-2" @click="close">Отмена</button>
            <button class="btn btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['update:show']);

const userStore = useUserStore();

const form = reactive({
  username: '',
  email: ''
});

watch(
    () => props.show,
    (value) => {
      if (value) {
        form.username = userStore.user.username;
        form.email = userStore.user.email;
      }
    }
);

function close() {
  emit('update:show', false);
}

async function save() {
  await userStore.updateUser(form);
  close();
}
</script>
<template>
  <div class="profile-header bg-light py-4 mb-4">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-auto">
            <img 
                src="../assets/img/account-image.png"
                class="rounded-circle"
                width="80"
                height="80"
                alt="avatar"
            />
        </div>
        
        <div class="col">
          <h2 class="mb-1">{{ user.name || 'User' }}</h2>
          <p class="mb-1 text-muted">@{{ user.username || 'username' }}</p>
          <p class="mb-0">{{ user.bio || 'Расскажите о себе…' }}</p>
        </div>

        <div class="col-auto">
          <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#editProfileModal">Редактировать профиль</button>
        </div>
      </div>
    </div>

    <EditProfileModal :user="user" @save="emit('update', $event)"/>
  </div>
</template>

<script setup>
import EditProfileModal from './EditProfileModal.vue'

defineProps({
  user: {
    type: Object,
    required: true
  },
})

const emit = defineEmits(['update'])
</script>
<script setup>
// import Navbar from '@/components/Navbar.vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import ProfileHeader from '@/components/ProfileHeader.vue'
import UserRecipes from '@/components/UserRecipes.vue'
import UserStared from '@/components/UserStared.vue'

import { useAccount } from '@/composables/useAccount'
import useStared from '@/composables/useStared'

const {
  user,
  recipes,
  updateProfile,
  createRecipe,
  deleteRecipe,
} = useAccount()

const { staredRecipes } = useStared()
</script>

<template>
  <!-- <Navbar /> -->
  <base-layout>
  <ProfileHeader :user="user" @update="updateProfile"/>

  <div class="container mt-4">
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#my">
          Мои рецепты
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#stared">Сохранённое</button>
      </li>
    </ul>

    <div class="tab-content">
      <div class="tab-pane fade show active" id="my">
        <UserRecipes
          :recipes="recipes"
          @create="createRecipe"
          @delete="deleteRecipe"
        />
      </div>

      <div class="tab-pane fade" id="stared">
        <UserStared :recipes="staredRecipes" :user="user" />
      </div>
    </div>
  </div>
  </base-layout>
</template>

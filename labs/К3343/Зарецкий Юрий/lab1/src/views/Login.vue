<template>
  <div>
    <Navbar />
    <main id="main-content" class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-5 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <h2 class="card-title text-center mb-4">Вход в систему</h2>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/common/Navbar.vue'
import LoginForm from '@/components/forms/LoginForm.vue'
</script>

<template>
  <section>
    <div class="card glass-card">
      <div class="card-body">
        <h2 class="card-title elegant-heading light-blue-text">Quick Access</h2>
        <div class="d-grid gap-2">
          <router-link to="/workouts" class="btn btn-elegant">Workouts</router-link>
          <router-link to="/blog" class="btn btn-elegant">Blog</router-link>
          <router-link to="/profile" class="btn btn-elegant">Profile</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default { name: 'QuickAccessCard' }
</script>

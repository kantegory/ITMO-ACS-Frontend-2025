<template>
  <footer class="footer mt-5 py-4">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <p class="mb-0">© 2026 RentSpace. Все права защищены.</p>
        </div>
        <div class="col-md-6 text-md-end">
          <a href="#" class="text-decoration-none me-3">Политика конфиденциальности</a>
          <a href="#" class="text-decoration-none">Контакты</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped>
.footer {
  background-color: var(--card-bg);
  color: var(--text-color);
}

.footer a {
  color: inherit;
  transition: color 0.3s;
}

.footer a:hover {
  text-decoration: underline;
}
</style>

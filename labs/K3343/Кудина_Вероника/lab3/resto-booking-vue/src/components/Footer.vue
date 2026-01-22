<template>
  <footer class="footer bg-dark text-white mt-auto py-4">
    <div class="container">
      <div class="row">
        <div class="col-md-3 mb-3">
          <h5 class="text-white"><i class="bi bi-shop"></i> РестоБронь</h5>
          <p class="text-light small opacity-75">Бронируйте столики в лучших ресторанах вашего города</p>
        </div>
        
        <div class="col-md-3 mb-3">
          <h5 class="text-white">Навигация</h5>
          <ul class="list-unstyled">
            <li><router-link to="/" class="text-light text-decoration-none opacity-75 hover-link">Главная</router-link></li>
            <li><router-link to="/restaurants" class="text-light text-decoration-none opacity-75 hover-link">Рестораны</router-link></li>
            <li><router-link to="/profile" class="text-light text-decoration-none opacity-75 hover-link">Профиль</router-link></li>
          </ul>
        </div>

        <div class="col-md-3 mb-3">
          <h5 class="text-white">Контакты</h5>
          <p class="text-light small mb-1 opacity-75">
            <i class="bi bi-telephone"></i> +7 (999) 123-45-67
          </p>
          <p class="text-light small mb-1 opacity-75">
            <i class="bi bi-envelope"></i> info@restobron.ru
          </p>
          <p class="text-light small mb-0 opacity-75">
            <i class="bi bi-geo-alt"></i> Москва, Россия
          </p>
        </div>

        <div class="col-md-3 mb-3">
          <h5 class="text-white">Социальные сети</h5>
          <div class="fs-4">
            <a href="#" class="text-white me-3 hover-icon"><i class="bi bi-instagram"></i></a>
            <a href="#" class="text-white me-3 hover-icon"><i class="bi bi-telegram"></i></a>
            <a href="#" class="text-white hover-icon"><i class="bi bi-vk"></i></a>
          </div>
        </div>
      </div>
      
      <hr class="my-3 border-light opacity-25">
      
      <div class="row">
        <div class="col-md-12 text-center">
          <p class="mb-0 small text-light opacity-75">&copy; 2026 РестоБронь. Все права защищены.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  background-color: #212529 !important;
}

.footer i {
  margin-right: 0.5rem;
}

.hover-link:hover {
  opacity: 1 !important;
  text-decoration: underline !important;
}

.hover-icon {
  transition: transform 0.2s;
}

.hover-icon:hover {
  transform: scale(1.2);
}

.list-unstyled li {
  margin-bottom: 0.5rem;
}
</style>
<template>
  <div>
    <Navbar />
    <main id="main-content" class="container mt-5">
      <div class="row">
        <div class="col-12 text-center mb-5">
          <h1 class="display-4 mb-3">Найдите идеальную недвижимость для аренды</h1>
          <p class="lead mb-4">Тысячи вариантов квартир, домов и офисов по всей России</p>
          <router-link 
            to="/search" 
            class="btn btn-primary btn-lg d-inline-flex align-items-center"
            aria-label="Перейти на страницу поиска недвижимости"
          >
            <Icon name="search" size="md" extra-class="me-2 icon-inline" />
            <span>Начать поиск</span>
          </router-link>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h3 class="card-title d-flex align-items-center justify-content-center gap-2">
                <Icon name="home" size="lg" />
                <span>Квартиры</span>
              </h3>
              <p class="card-text">Широкий выбор квартир для аренды на любой срок</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h3 class="card-title d-flex align-items-center justify-content-center gap-2">
                <Icon name="building" size="lg" />
                <span>Дома</span>
              </h3>
              <p class="card-text">Уютные дома для комфортного проживания</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h3 class="card-title d-flex align-items-center justify-content-center gap-2">
                <Icon name="building" size="lg" />
                <span>Офисы</span>
              </h3>
              <p class="card-text">Помещения для бизнеса в удобных локациях</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/common/Navbar.vue'
import Icon from '@/components/common/Icon.vue'
</script>

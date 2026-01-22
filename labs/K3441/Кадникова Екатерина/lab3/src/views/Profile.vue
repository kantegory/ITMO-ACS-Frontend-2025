<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { usePropertyStore } from '@/stores/propertyStore';
import { useRentalStore } from '@/stores/rentalStore';

import EditProfileModal from '@/components/profile/EditProfileModal.vue';
import EditPropertyModal from '@/components/profile/EditPropertyModal.vue';
import MyPropertyCard from '@/components/profile/MyPropertyCard.vue';
import MyRentalCard from '@/components/profile/MyRentalCard.vue';
import MyPropertyRentalCard from '@/components/profile/MyPropertyRentalCard.vue';

const activeTab = ref('rentals');

const userStore = useUserStore();
const propertyStore = usePropertyStore();
const rentalStore = useRentalStore();

const showEditProfile = ref(false);
const showEditProperty = ref(false);
const editingProperty = ref(null);

onMounted(async () => {
  await userStore.loadMe();

  if (userStore.user?.id) {
    await rentalStore.loadMy();
    await propertyStore.loadUserProperties(userStore.user.id);
  }
});

function openEditProfile() {
  showEditProfile.value = true;
}

function openEditProperty(property) {
  editingProperty.value = property;
  showEditProperty.value = true;
}
</script>

<template>
  <div class="container my-4">

    <div class="row">
      <div class="col-lg-3">
        <div class="card p-4 text-center">
          <div class="avatar-circle mx-auto mb-3">
            {{ userStore.user?.username?.charAt(0).toUpperCase() || '?' }}
          </div>

          <h5>{{ userStore.user?.username }}</h5>
          <p class="text-muted">{{ userStore.user?.email }}</p>

          <div class="badge bg-info">
            {{ userStore.user?.role === 'ADMIN' ? 'Администратор' : 'Пользователь' }}
          </div>


          <div class="row text-center mt-3">
            <div class="col">
              <div class="h5">{{ propertyStore.list.length }}</div>
              <small class="text-muted">Объектов</small>
            </div>
            <div class="col">
              <div class="h5">{{ rentalStore.list.length }}</div>
              <small class="text-muted">Аренд</small>
            </div>
          </div>

          <button class="btn btn-primary mt-3" @click="openEditProfile">
            <svg class="icon me-1" aria-hidden="true">
              <use xlink:href="#icon-pencil-square"></use>
            </svg>
            Редактировать профиль
          </button>

          <router-link to="/add-property" class="btn btn-success mt-2">
            <svg class="icon me-1" aria-hidden="true">
              <use xlink:href="#icon-plus-circle"></use>
            </svg>
            Добавить объект
          </router-link>

          <button class="btn btn-outline-danger mt-2" @click="userStore.logout">
            Выйти
          </button>
        </div>
      </div>

      <div class="col-lg-9">
        <div class="card p-4">

          <ul class="nav nav-tabs">
            <li class="nav-item">
              <button class="nav-link" :class="{active:activeTab==='rentals'}" @click="activeTab='rentals'">
                Мои заявки на аренду
              </button>
            </li>

            <li class="nav-item">
              <button class="nav-link" :class="{active:activeTab==='properties'}" @click="activeTab='properties'">
                Мои объекты
              </button>
            </li>
          </ul>

          <div v-if="activeTab === 'rentals'" class="mt-4">
            <template v-if="rentalStore.list.length === 0">
              <div class="text-center py-5">
                <h5>У вас пока нет заявок на аренду</h5>
                <p class="text-muted">Найдите недвижимость и отправьте заявку</p>
                <router-link to="/" class="btn btn-primary mt-2">
                  <svg class="icon me-1" aria-hidden="true">
                    <use xlink:href="#icon-search"></use>
                  </svg>
                  Найти недвижимость
                </router-link>
              </div>
            </template>
            <template v-else>
              <MyRentalCard
                  v-for="r in rentalStore.list"
                  :key="r.id"
                  :rental="r"
              />
            </template>
          </div>

          <div v-if="activeTab === 'properties'" class="mt-4">
            <template v-if="propertyStore.list.length === 0">
              <div class="text-center py-5">
                <h5>У вас пока нет объектов недвижимости</h5>
                <router-link to="/add-property" class="btn btn-success mt-3">
                  <svg class="icon me-1" aria-hidden="true">
                    <use xlink:href="#icon-plus-circle"></use>
                  </svg>
                  Добавить объект
                </router-link>
              </div>
            </template>

            <template v-else>
              <div class="row">
                <MyPropertyCard
                    v-for="p in propertyStore.list"
                    :key="p.id"
                    :property="p"
                    @edit="openEditProperty"
                    @delete="propertyStore.remove"
                />
              </div>

              <h5 class="mt-4">Заявки на ваши объекты</h5>
              <template v-if="rentalStore.list.filter(r => propertyStore.list.some(p => p.id === r.propertyId)).length === 0">
                <p class="text-muted">Здесь пока что ничего нет</p>
              </template>
              <template v-else>
                <MyPropertyRentalCard
                    v-for="r in rentalStore.list.filter(r => propertyStore.list.some(p => p.id === r.propertyId))"
                    :key="r.id"
                    :rental="r"
                    @update="rentalStore.updateStatus"
                />
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>

    <EditProfileModal v-model:show="showEditProfile" />
    <EditPropertyModal v-model:show="showEditProperty" :property="editingProperty" />

  </div>
</template>
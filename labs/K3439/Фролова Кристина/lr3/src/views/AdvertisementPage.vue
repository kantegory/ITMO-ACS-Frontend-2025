<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { advertisementsApi, usersApi, messagesAuthApi, usersMeApi } from "@/api";
import OwnerCard from "@/components/OwnerCard.vue";
import ContactModal from "@/components/ContactModal.vue";
import { formatPricePerPeriod, livingTypeToText } from "@/utils/mappers.js";
import { Carousel } from "bootstrap";

const meId = ref(null);
const route = useRoute();
const id = route.params.id;

const advertisement = ref(null);
const loading = ref(true);
const error = ref(null);

const owner = ref(null);
const ownerLoading = ref(false);
const ownerError = ref(null);

const photos = computed(() => advertisement.value?.property?.photos ?? []);

let carouselInstance = null;

onBeforeUnmount(() => {
  if (carouselInstance) carouselInstance.dispose();
});

async function loadAdvert() {
  loading.value = true;
  error.value = null;
  try {
    const res = await advertisementsApi.getById(id);
    advertisement.value = res.data ?? res;
  } catch (e) {
    error.value = "Не удалось загрузить объявление";
  } finally {
    loading.value = false;
  }
}

async function loadOwner(ownerId) {
  ownerLoading.value = true;
  ownerError.value = null;
  try {
    const res = await usersApi.getById(ownerId);
    owner.value = res.data ?? res;
  } catch (e) {
    ownerError.value = "Не удалось загрузить данные владельца";
  } finally {
    ownerLoading.value = false;
  }
}

const priceText = computed(() => {
  if (!advertisement.value) return "";
  return formatPricePerPeriod(advertisement.value.pricePerPeriod, advertisement.value.rentType);
});

const paramsItems = computed(() => {
  const a = advertisement.value;
  const living = a?.property?.living;
  const property = a?.property;

  const items = [];
  if (living) {
    items.push(`Тип объекта: ${livingTypeToText(living.livingType)}`);
    if (living.totalRooms != null) items.push(`Комнат: ${living.totalRooms}`);
    if (living.area != null) items.push(`Площадь: ${living.area} м²`);
    if (living.flat?.floor != null && living.totalFloors != null) items.push(`Этаж: ${living.flat.floor} из ${living.totalFloors}`);
    if (living.flat?.kitchenArea != null) items.push(`Площадь кухни: ${living.flat.kitchenArea} м²`);
    if (living.comfort?.renovation) items.push(`Ремонт: ${living.comfort.renovation}`);
    if (living.comfort?.internet) items.push("Интернет: есть");
    if (living.comfort?.tv) items.push("Телевизор: есть");
    if (living.comfort?.furniture) items.push(`Мебель: ${living.comfort.furniture}`);
    if (living.comfort?.devices) items.push(`Техника: ${living.comfort.devices}`);
  }
  if (property?.totalArea != null) items.push(`Общая площадь: ${property.totalArea} м²`);
  return items;
});

function initCarousel() {
  const el = document.getElementById("photosCarousel");
  if (!el) return;

  if (carouselInstance) {
    carouselInstance.dispose();
    carouselInstance = null;
  }

  carouselInstance = Carousel.getOrCreateInstance(el, {
    interval: false,
    ride: false,
    wrap: true,
  });
}

async function handleContactSend({ receiverId, advertisementId, text }) {
  if (!meId.value) {
    alert("Чтобы отправить сообщение, нужно войти.");
    return;
  }

  try {
    await messagesAuthApi.send({
      senderId: meId.value,
      receiverId,
      advertisementId,
      text,
    });
  } catch (e) {
    console.error(e);
    alert("Не удалось отправить сообщение");
  }
}

onMounted(async () => {
  await loadAdvert();

  const ownerId = advertisement.value?.property?.ownerId;
  if (ownerId) await loadOwner(ownerId);

  try {
    const meRes = await usersMeApi.me();
    meId.value = (meRes.data ?? meRes)?.id ?? null;
  } catch {
    meId.value = null;
  }
});

watch(
  () => photos.value.length,
  async (len) => {
    if (len <= 1) return;
    await nextTick();
    initCarousel();
  },
  { immediate: true }
);
</script>


<template>
  <div v-if="loading" class="text-muted">Загрузка…</div>
  <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

  <main v-else id="main" class="py-4 flex-fill">
    <div class="container">
      <div class="row">
        <div class="col-lg-7 mb-4">

          <div
            id="photosCarousel"
            class="carousel slide mb-3"
            v-if="photos.length > 0"
          >
            <div class="carousel-inner">
              <div
                v-for="(photo, i) in photos"
                :key="photo.id ?? i"
                class="carousel-item"
                :class="{ active: i === 0 }"
              >
                <img
                  :src="photo.path"
                  class="d-block w-100"
                  style="height: 400px; object-fit: cover;"
                  :alt="advertisement?.title || 'Фото жилья'"
                />
              </div>
            </div>

            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#photosCarousel"
              data-bs-slide="prev"
            >
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Предыдущее</span>
            </button>

            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#photosCarousel"
              data-bs-slide="next"
            >
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Следующее</span>
            </button>
          </div>
          <h1 class="h4 mb-2">{{ advertisement.title }}</h1>

          <p class="mb-1 d-flex align-items-center gap-1 text-muted">
            <svg width="14" height="14">
              <use href="#icon-location"></use>
            </svg>
            {{ advertisement.property.location }}
          </p>

          <p class="h5 text-primary mb-3">
            {{ priceText }}
          </p>

          <h2 class="h6">Описание</h2>
          <p>{{ advertisement.description }}</p>

          <h2 class="h6">Условия аренды</h2>
          <ul>
            <li>Залог: {{ advertisement.deposit }} ₽</li>
            <li>Комиссия: {{ advertisement.commission }} ₽</li>
          </ul>

          <h2 class="h6 mb-3">Параметры</h2>
          <ul>
            <li v-for="(item, idx) in paramsItems" :key="idx">
              {{ item }}
            </li>
            <li v-if="paramsItems.length === 0">Параметры не указаны</li>
          </ul>
        </div>

        <div class="col-lg-5 mb-4">
          <OwnerCard :owner="owner" :loading="ownerLoading" :error="ownerError"/>
        </div>
        <ContactModal
          ref="contactModalRef"
          v-if="advertisement?.id && advertisement?.property?.ownerId"
          :advertisement-id="advertisement.id"
          :owner-id="advertisement.property.ownerId"
          @send="handleContactSend"
        />
      </div>
    </div>
  </main>
</template>

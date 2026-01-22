<script setup>
import { useUserStore } from "@/stores/user";
import { onMounted, ref } from "vue";

const props = defineProps(["name", "description", "imageLink", "id"]);

const buttonText = ref("Подписаться");

const userStore = useUserStore();

onMounted(async () => {
  try {
    await userStore.getCurrentUser();
    await userStore.getSubs();
    if (userStore.subsIds.includes(props.id)) {
      buttonText.value = "Отписаться";
    }
  } catch (error) {
    console.error("Ошибка загрузки пользователя:", error);
  }
});

const handleButton = async () => {
  if (props.id === userStore.currentUser.id) {
    return;
  }
  if (userStore.subsIds.includes(props.id)) {
    const subId = userStore.getSubId(props.id);
    if (subId) {
      userStore.unsubscribe(subId);
      buttonText.value = "Подписаться";
    }
  } else {
    userStore.subscribe(props.id);
    buttonText.value = "Отписаться";
  }
};
</script>

<template>
  <div class="col-md-4">
    <div class="card text-center shadow-sm border-0">
      <div class="card-body">
        <img
          :src="props.imageLink"
          :alt="props.name"
          class="rounded-circle mb-3"
          width="80"
          height="80"
          style="object-fit: cover"
        />
        <h5 class="card-title">{{ props.name }}</h5>
        <p class="card-text text-muted small">{{ props.description }}</p>
        <button @click="handleButton" class="btn btn-outline-danger btn-sm">
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

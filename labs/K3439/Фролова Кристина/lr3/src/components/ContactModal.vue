<script setup>
import { ref } from "vue";

const props = defineProps({
  advertisementId: { type: [Number, String], required: true },
  ownerId: { type: [String, Number], required: true },
});

const emit = defineEmits(["send"]);
const message = ref("");

function send() {
  const text = message.value.trim();
  if (!text) return;

  emit("send", {
    receiverId: props.ownerId,
    advertisementId: Number(props.advertisementId),
    text,
  });

  message.value = "";
}
</script>

<template>
  <div
    class="modal fade"
    id="contactModal"
    tabindex="-1"
    aria-labelledby="contactModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="contactModalLabel">Написать владельцу</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть" />
        </div>

        <div class="modal-body">
          <label for="contactMessage" class="form-label">Сообщение</label>
          <textarea
            id="contactMessage"
            class="form-control"
            rows="4"
            placeholder="Здравствуйте, меня интересует этот объект..."
            v-model="message"
          />
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
          <button class="btn btn-primary" :disabled="!message.trim()" @click="send" data-bs-dismiss="modal">
            Отправить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<template>
  <div class="custom-modal">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-header">
          <div class="d-flex align-items-center">
            <svg class="icon me-2 header-icon">
              <use href="#icon-calendar"></use>
            </svg>
            <h5 class="modal-title">Оформление аренды</h5>
          </div>

          <button class="btn-close" @click="$emit('close')" />
        </div>

        <div class="modal-body">
          <form @submit.prevent="submit">
            <input type="hidden" :value="propertyId" />

            <div class="row g-3 mb-4">

              <div class="col-md-6">
                <label class="form-label d-flex align-items-center">
                  <svg class="icon me-2"><use href="#icon-calendar"></use></svg>
                  Дата начала
                </label>
                <input
                    v-model="startedAt"
                    type="date"
                    class="form-control form-control-lg"
                    required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label d-flex align-items-center">
                  <svg class="icon me-2"><use href="#icon-calendar"></use></svg>
                  Дата окончания
                </label>
                <input
                    v-model="endedAt"
                    type="date"
                    class="form-control form-control-lg"
                    required
                />
              </div>

            </div>

            <div class="alert alert-info d-flex align-items-center">
              <svg class="icon me-2"><use href="#icon-info-circle"></use></svg>
              Владелец получит вашу заявку и свяжется с вами
            </div>

            <div class="d-grid gap-2 mt-4">
              <button class="btn btn-primary btn-lg d-flex justify-content-center align-items-center">
                <svg class="icon me-2"><use href="#icon-check-circle"></use></svg>
                Оформить аренду
              </button>

              <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="$emit('close')"
              >
                <svg class="icon me-2"><use href="#icon-arrow-left"></use></svg>
                Отмена
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>

    <div class="custom-modal-backdrop" @click="$emit('close')"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createRental } from '@/api/rentals.api';
import { useAuth } from '@/composables/useAuth';

const props = defineProps({ propertyId: Number });
const emit = defineEmits(['close']);

const startedAt = ref('');
const endedAt = ref('');

const auth = useAuth();

async function submit() {
  if (!auth.isAuthenticated.value) {
    return alert('Для аренды необходимо войти в систему');
  }

  try {
    await createRental({
      propertyId: props.propertyId,
      startedAt: startedAt.value,
      endedAt: endedAt.value
    });

    alert('Заявка отправлена');
    emit('close');
  } catch (err) {
    alert(err.message || 'Ошибка оформления');
  }
}
</script>

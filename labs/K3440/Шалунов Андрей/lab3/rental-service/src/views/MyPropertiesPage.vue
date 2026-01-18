<template>
    <AppNavbar />
    <BaseLayout>
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h3 mb-0">Мои объявления</h1>
            <button class="btn btn-primary" type="button" @click="openCreate">
                Создать объявление
            </button>
        </div>

        <div v-if="store.error" class="alert alert-danger" role="alert">{{ store.error }}</div>
        <div v-if="store.loading" class="text-muted">Загружаем ваши объявления...</div>

        <div v-else>
            <div v-if="store.items.length === 0" class="alert alert-info" role="status">
                У вас пока нет объявлений. Нажмите «Создать объявление», чтобы добавить первое.
            </div>

            <div v-else class="row g-3">
                <div v-for="p in store.items" :key="p.property_id" class="col-12 col-md-4">
                    <MyPropertyCard :property="p" @edit="openEdit" @delete="openDelete" />
                </div>
            </div>
        </div>

        <ModalShell v-if="showFormModal" dialogClass="modal-lg">
            <form class="modal-content" @submit.prevent="onSubmit">
                <div class="modal-header">
                    <h2 class="modal-title h5">
                        {{ isEdit ? "Редактировать объявление" : "Создать объявление" }}
                    </h2>
                    <button type="button" class="btn-close" aria-label="Закрыть" @click="closeForm"></button>
                </div>

                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Заголовок</label>
                        <input v-model="form.title" type="text" class="form-control" required />
                    </div>

                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label">Тип жилья</label>
                            <select v-model="form.type" class="form-select" required>
                                <option value="flat">Квартира</option>
                                <option value="house">Дом</option>
                                <option value="room">Комната</option>
                            </select>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label">Статус</label>
                            <select v-model="form.status" class="form-select" required>
                                <option value="available">Свободно</option>
                                <option value="occupied">Занято</option>
                                <option value="closed">Неактивно</option>
                            </select>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label">Цена в сутки, ₽</label>
                            <input v-model="form.price_per_day" type="number" min="0" class="form-control" required />
                        </div>
                    </div>

                    <div class="mt-3 mb-3">
                        <label class="form-label">Адрес / локация</label>
                        <input v-model="form.location" type="text" class="form-control" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Описание</label>
                        <textarea v-model="form.description" class="form-control" rows="3" required></textarea>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Особенности (по одной в строке, необязательно)</label>
                        <textarea v-model="form.features" class="form-control" rows="2"></textarea>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Условия аренды (по одной в строке, необязательно)</label>
                        <textarea v-model="form.rental_terms" class="form-control" rows="2"></textarea>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Фотографии (URL, по одной ссылке в строке)</label>
                        <textarea v-model="photoUrlsText" class="form-control" rows="3"></textarea>
                    </div>

                    <div v-if="formError" class="alert alert-danger" role="alert">{{ formError }}</div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" @click="closeForm" :disabled="store.loading">
                        Отмена
                    </button>
                    <button type="submit" class="btn btn-primary" :disabled="store.loading">
                        {{ isEdit ? "Сохранить" : "Создать" }}
                    </button>
                </div>
            </form>
        </ModalShell>

        <ModalShell v-if="showDeleteModal">
            <div class="modal-header">
                <h2 class="modal-title h5">Удалить объявление</h2>
                <button type="button" class="btn-close" aria-label="Закрыть" @click="closeDelete"></button>
            </div>

            <div class="modal-body">
                Вы уверены, что хотите удалить объявление <span class="fw-semibold">{{ deleteTitle }}</span>?
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" @click="closeDelete" :disabled="store.loading">
                    Отмена
                </button>
                <button type="button" class="btn btn-danger" @click="confirmDelete" :disabled="store.loading">
                    Удалить
                </button>
            </div>
        </ModalShell>
    </BaseLayout>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useMyPropertiesStore } from "@/stores/myProperties";

import AppNavbar from "@/components/AppNavbar.vue";
import BaseLayout from "@/layouts/BaseLayout.vue";
import MyPropertyCard from "@/components/MyPropertyCard.vue";
import ModalShell from "@/components/ModalShell.vue";

const auth = useAuthStore();
const store = useMyPropertiesStore();

const ownerId = computed(() => auth.user?.user_id || auth.user?.id || null);

const showFormModal = ref(false);
const showDeleteModal = ref(false);

const isEdit = ref(false);
const editId = ref(null);

const deleteId = ref(null);
const deleteTitle = ref("");

const photoUrlsText = ref("");
const formError = ref("");

const form = reactive({
    title: "",
    type: "flat",
    status: "available",
    price_per_day: "",
    location: "",
    description: "",
    features: "",
    rental_terms: ""
});

function resetForm() {
    form.title = "";
    form.type = "flat";
    form.status = "available";
    form.price_per_day = "";
    form.location = "";
    form.description = "";
    form.features = "";
    form.rental_terms = "";
    photoUrlsText.value = "";
    formError.value = "";
}

function openCreate() {
    resetForm();
    isEdit.value = false;
    editId.value = null;
    showFormModal.value = true;
}

function openEdit(p) {
    resetForm();
    isEdit.value = true;
    editId.value = p.property_id;

    form.title = p.title || "";
    form.type = p.type || "flat";
    form.status = p.status || "available";
    form.price_per_day = p.price_per_day != null ? String(Number(p.price_per_day)) : "";
    form.location = p.location || "";
    form.description = p.description || "";
    form.features = p.features || "";
    form.rental_terms = p.rental_terms || "";

    showFormModal.value = true;
}

function closeForm() {
    showFormModal.value = false;
}

function openDelete(p) {
    deleteId.value = p.property_id;
    deleteTitle.value = `«${p.title || "объявление"}»`;
    showDeleteModal.value = true;
}

function closeDelete() {
    showDeleteModal.value = false;
    deleteId.value = null;
    deleteTitle.value = "";
}

function buildDto() {
    const price = Number(form.price_per_day);

    if (!form.title.trim() || !form.location.trim() || !form.description.trim()) return null;
    if (!Number.isFinite(price) || price < 0) return "PRICE_INVALID";

    return {
        title: form.title.trim(),
        type: form.type,
        status: form.status,
        price_per_day: price,
        location: form.location.trim(),
        description: form.description.trim(),
        features: form.features.trim() || undefined,
        rental_terms: form.rental_terms.trim() || undefined
    };
}

async function onSubmit() {
    formError.value = "";

    if (!ownerId.value) {
        formError.value = "Не удалось определить пользователя (owner_id).";
        return;
    }

    const dto = buildDto();
    if (dto === null) {
        formError.value = "Заполните обязательные поля.";
        return;
    }
    if (dto === "PRICE_INVALID") {
        formError.value = "Введите корректную цену.";
        return;
    }

    let ok = false;
    if (isEdit.value && editId.value) {
        ok = await store.update(ownerId.value, editId.value, dto, photoUrlsText.value);
    } else {
        ok = await store.create(ownerId.value, dto, photoUrlsText.value);
    }

    if (ok) showFormModal.value = false;
}

async function confirmDelete() {
    if (!ownerId.value || !deleteId.value) return;
    const ok = await store.remove(ownerId.value, deleteId.value);
    if (ok) closeDelete();
}

onMounted(async () => {
    if (auth.isAuthed && !auth.user) await auth.fetchMe();
    if (ownerId.value) await store.loadMine(ownerId.value);
});

watch(ownerId, async (val) => {
    if (val) await store.loadMine(val);
});
</script>
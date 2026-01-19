<template>
<div class="profile-container">
    <h2>Профиль пользователя</h2>

    <div class="profile-header">
        <img src="/images/default.jpg" class="avatar" id="avatar" />
        <div class="user-info" id="userInfo">
            <div v-for="(value, field) in user" :key="field">
                <template v-if="fieldsMap.has(field)">
                    <b>{{ fieldsMap.get(field) }}:</b> {{ value }}
                </template>
            </div>
        </div>
    </div>

    <div v-if="editMode" class="edit-block" id="editBlock">
        <template v-for="(_, field) in user" :key="field">
            <input v-if="fieldsMap.has(field)" v-model="editFields[field]">
        </template>

        <div class="edit-actions">
            <button class="btn btn-success" @click="saveChanges">Сохранить</button>
            <button class="btn btn-secondary" @click="cancelEdit">Отмена</button>
        </div>
    </div>

    <button v-else class="btn btn-primary" @click="enableEdit" id="editBtn">Редактировать</button>

    <div class="history">
        <h3>История сделок</h3>
        <div class="deal">Аренда квартиры — Москва, ул. Лесная, 12 — 45 000 ₽</div>
        <div class="deal">Аренда комнаты — Санкт-Петербург, Невский 88 — 18 000 ₽</div>
    </div>

    <button class="btn btn-danger" @click="logout">Выйти из аккаунта</button>
</div>
</template>

<script setup>
import useUserStore from '@/stores/userStorage'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'

const router = useRouter()

const userStorage = useUserStore()
const { clearUserData } = userStorage
const { user } = storeToRefs(userStorage)

const fieldsMap = new Map([
    ["name", "Имя"], 
    ["email", "Адрес эл. почты"], 
    ["phone", "Номер телефона"],
    ["city", "Город"]
])

const editFields = reactive({
    name: '',
    email: '',
    phone: '',
    city: ''
})

const editMode = ref(false)

function enableEdit() {
    Object.assign(editFields, user.value)
    editMode.value = true
}

function saveChanges() {
    editMode.value = false
    Object.assign(user.value, editFields)
}

function cancelEdit() {
    editMode.value = false
}

function logout() {
    clearUserData()
    router.push("/login")
}

</script>

<style lang="css" scoped>
@import 'bootstrap/dist/css/bootstrap.min.css';

.btn {
    border-radius: 4px;
}

.profile-container {
    max-width: 1100px;
    margin: 40px auto;
    background: var(--bg-surface);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

h2 { 
    color: var(--green-main); 
    margin-bottom: 20px; 
}

.profile-header {
    display: flex; 
    align-items: center; 
    gap: 25px;
    margin-bottom: 30px;
}

.avatar {
    width: 144px; 
    height: 144px;
    border-radius: 50%;
    object-fit: cover; 
    border: 3px solid var(--border-main);
}

.user-info div { 
    margin-bottom: 8px; 
    font-size: 16px; 
}

.edit-block input {
    width: 100%; 
    padding: 10px;
    margin-bottom: 10px; 
    border-radius: 10px;
    border: 1px solid var(--border-main);
}

.edit-actions {
    display: flex; 
    gap: 10px; 
    margin-top: 10px;
}

.history {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid var(--history-border);
}

.deal {
    background: var(--bg-soft); 
    padding: 15px;
    border-radius: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    margin-bottom: 12px;
}
</style>
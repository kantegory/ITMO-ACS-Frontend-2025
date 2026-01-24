<template>
    <nav>
        <router-link class="logo" :to="{ name: 'main' }">GreenRent</router-link>
        <label for="citySelect" style="color: #3c8c5a; font-size: 18px;">Ваш город:</label>
        <select id="citySelect">
            <option>Санкт-Петербург</option>
            <option>Москва</option>
            <option>Екатеринбург</option>
        </select>
        <div class="nav-links" id="navLinks">
            <template v-if="user.email">
                <a href="#">Сдать в аренду</a>
                <a href="#">Чаты</a>
                <router-link :to="{ name: 'profile' }">{{ user.email }}</router-link>
            </template>
            <template v-else>
                <router-link :to="{ name: 'login' }">Войти</router-link>
                <router-link :to="{ name: 'register' }">Регистрация</router-link>
            </template>
        </div>
    </nav>
</template>

<script setup>
import useUserStore from '@/stores/userStorage'
import { storeToRefs } from 'pinia'

const userStorage = useUserStore()
const { user } = storeToRefs(userStorage)

</script>

<style scoped>
    nav {
        display: flex;
        justify-content: flex-start;
        gap: 20px;
        align-items: center;
        background: var(--bg-surface);
        padding: 15px 40px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        position: sticky;
        top: 0;
        z-index: 100;
    }

    .icon {
        width: 24px;
        height: 24px;
        fill: var(--icon);
        display: inline-block;
    }

    #citySelect {
        float: left;
        padding: 8px;
        border: 1px solid var(--border-main);
        border-radius: 5px;
        outline: none;
        margin-right:20px;
    }

    .logo {
        font-size: 22px;
        font-weight: bold;
        text-decoration: none;
        color: var(--green-main);
        background: none;
        border: none;
        cursor: pointer;
    }

    .nav-links {
        margin-left: auto;
    }

    .nav-links a, .nav-links button {
        margin-left: 20px;
        text-decoration: none;
        color: var(--green-main);
        font-size: 16px;
        background: none;
        border: none;
        cursor: pointer;
    }

    .nav-links button:hover, .nav-links a:hover, .logo a:hover { color: var(--green-hover); }
</style>

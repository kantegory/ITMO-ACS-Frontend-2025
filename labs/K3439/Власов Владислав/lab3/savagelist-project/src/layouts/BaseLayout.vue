<script setup>
    import NavButton from '@/components/NavBut.vue'; // Путь может отличаться в зависимости от настроек

    // Список основных разделов
    const navItems = [
        { label: 'Персонажи', to: { name: 'characters' }, disabled: false },
        { label: 'Навыки', to: { name: 'skills' }, disabled: false },
        { label: 'Черты', to: { name: 'edges' }, disabled: true },
        { label: 'Предметы', to: { name: 'items' }, disabled: true },
    ];

    // Список пользовательских действий
    const userItems = [
        { label: 'Профиль', to: { name: 'profile' }},
        { label: 'Выход', to: { name: 'auth' }},
    ];
</script>
    
<template>
    <div class="layout-container">
    <header class="main-header">
        <div class="logo">
        <h3>SavageList</h3>
        </div>

        <nav class="nav-group">
        <NavButton
            v-for="item in navItems"
            :key="item.label"
            :label="item.label"
            :icon="item.icon"
            :to="item.to"
            :is-disabled="item.disabled"
        />
        </nav>

        <div class="user-group">
            <NavButton
                v-for="item in userItems"
                :key="item.label"
                :label="item.label"
                :icon="item.icon"
                :to="item.to"
                :is-action="true"
            />
        </div>
    </header>

    <main class="main-content">
        <slot></slot> 
    </main>
    </div>
</template>
    
<style scoped>
    
    /* Общий контейнер */
    .layout-container {
        min-height: 100vh;
        background-color: #f5f5f5; /* Светлый фон для основного контента */
    }

    /* Шапка сайта */
    .main-header {
        background-color: #1e2329; /* Темный фон как за пределами карточки входа */
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 40px;
        height: 64px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    /* Логотип */
    .logo h3 {
        color: #dccc94; /* Золотой из шапки карточки */
        font-family: "Times New Roman", Times, serif;
        font-size: 1.5rem;
        margin: 0;
        letter-spacing: 1px;
    }

    /* Группировка кнопок */
    .nav-group, .user-group {
        display: flex;
        gap: 10px;
        align-items: center;
    }
</style>
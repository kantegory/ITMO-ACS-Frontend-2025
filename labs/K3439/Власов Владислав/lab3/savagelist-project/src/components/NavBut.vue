<script setup>
     
    const props = defineProps({
        label: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: ''
        },
        to: {
            type: String,
            default: '#'
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        isAction: {
            type: Boolean,
            default: false
        }
    });
    
    const buttonClasses = {
        'nav-btn': true,
        'nav-btn--disabled': props.isDisabled,
        'nav-btn--action': props.isAction
    };
</script>
    
<template>
    <component
        :is="isDisabled ? 'span' : 'RouterLink'"
        :to="to"
        :class="buttonClasses"
    >
        <span class="nav-btn__label">{{ label }}</span>
    </component>
</template>
    
<style scoped>
  /* Базовая кнопка */
  .nav-btn {
    text-decoration: none;
    color: #ffffff; /* Белый текст на темном фоне */
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    border: 1px solid transparent;
  }

  .nav-btn:hover {
    color: #dccc94; /* Текст становится золотым при наведении */
    background: rgba(255, 255, 255, 0.05);
  }

  /* Кнопка "Action" (Выход, Профиль) */
  .nav-btn--action {
    color: #dccc94; /* Сразу золотая */
    border: 1px solid #dccc94; /* Тонкая золотая рамка */
  }

  .nav-btn--action:hover {
    background: #dccc94;
    color: #1e2329; /* Инверсия цветов при наведении */
  }

  /* Неактивная кнопка */
  .nav-btn--disabled {
    color: #5f6368; /* Серый текст */
    cursor: not-allowed;
    pointer-events: none; /* Отключаем клики */
  }

  /* Если есть иконки внутри кнопки */
  .nav-btn__label {
    display: inline-block;
  }

  .router-link-active.nav-btn {
    border-bottom: 2px solid #dccc94;
    border-radius: 0;
  }
</style>
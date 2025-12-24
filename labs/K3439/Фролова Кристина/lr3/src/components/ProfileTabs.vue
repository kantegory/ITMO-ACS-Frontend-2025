<script setup>
const modelValue = defineModel({ type: String, default: "my-properties" });

function setTab(tab) {
  modelValue.value = tab;
}
</script>

<template>
  <ul class="nav nav-tabs" id="profileTabs" role="tablist">
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        :class="{ active: modelValue === 'my-properties' }"
        id="tab-my-properties"
        type="button"
        role="tab"
        aria-controls="my-properties"
        :aria-selected="modelValue === 'my-properties'"
        @click="setTab('my-properties')"
      >
        Мои объекты
      </button>
    </li>

    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        :class="{ active: modelValue === 'renting' }"
        id="tab-renting"
        type="button"
        role="tab"
        aria-controls="renting"
        :aria-selected="modelValue === 'renting'"
        @click="setTab('renting')"
      >
        Я арендую
      </button>
    </li>

    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        :class="{ active: modelValue === 'history' }"
        id="tab-history"
        type="button"
        role="tab"
        aria-controls="history"
        :aria-selected="modelValue === 'history'"
        @click="setTab('history')"
      >
        Диалоги
      </button>
    </li>
  </ul>
</template>

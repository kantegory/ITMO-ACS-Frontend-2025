<template>
<Header/>
<main>
  <div class="main-container">
    <div class="filters">
      <div v-for="filter in filtersConfig" :key="filter.id" class="filter" :data-filter="filter.id">

        <template v-if="filter.type === 'select'">
          <label :for="filter.id">{{ filter.label }}</label>

          <select :id="filter.id" v-model="filters[filter.id]" @change="handleFilterChange">
            <option v-for="option in filter.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </template>

        <template v-else-if="filter.type === 'checkbox-group'">
          <h3>{{ filter.label }}</h3>

          <label v-for="option in filter.options" :key="option.value">
            <input type="checkbox" v-model="filters[filter.id]" :value="option.value" @change="handleFilterChange">
            {{ option.label }}
          </label>
        </template>

      </div>
      <button class="apply-btn" onclick="filterProperties()" title="apply">Применить</button>
    </div>

    <div id="cards" class="cards">
      <PropertyCard
        v-for="property in properties"
        :key="property.id"
        :property="property"
      />
    </div>
  </div>
</main>

<Footer/>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import PropertyCard from '@/components/PropertyCard.vue';
import usePropertyStore from '@/stores/propertyStorage';
import { ref, reactive, onMounted } from 'vue';
import { storeToRefs } from 'pinia'

const filtersConfig = [
  {
    id: 'type',
    label: 'Тип жилья',
    type: 'select',
    options: [
      { value: 'default', label: '---' },
      { value: 'flat', label: 'Квартира' },
      { value: 'room', label: 'Комната' },
      { value: 'house', label: 'Дом' },
      { value: 'garage', label: 'Гараж' }
    ]
  },
  {
    id: 'price',
    label: 'Ценовой диапазон',
    type: 'select',
    options: [
      { value: 'default', label: '---' },
      { value: '0-20000', label: 'До 20 000 ₽' },
      { value: '20000-40000', label: '20 000 – 40 000 ₽' },
      { value: '40000-60000', label: '40 000 – 60 000 ₽' },
      { value: '60000-999999', label: '60 000+ ₽' }
    ]
  },
  {
    id: 'features',
    label: 'Особенности',
    type: 'select',
    options: [
      { value: 'default', label: '---' },
      { value: 'children', label: 'С детьми' },
      { value: 'animals', label: 'С животными' },
      { value: 'balcony', label: 'С балконом' },
      { value: 'new_building', label: 'В новостройке' }
    ]
  },
  {
    id: 'is_daily_payment',
    label: 'Оплата',
    type: 'checkbox-group',
    options: [
      { value: 'true', label: 'Посуточно' },
      { value: 'false', label: 'Ежемесячно' }
    ]
  },
  {
    id: 'location',
    label: 'Расположение',
    type: 'checkbox-group',
    options: [
      { value: 'near_metro', label: 'Рядом с метро' },
      { value: 'center', label: 'У центра' }
    ]
  },
  {
    id: 'rooms',
    label: 'Кол-во комнат',
    type: 'checkbox-group',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: 'more', label: 'Более' }
    ]
  }
]

const filters = reactive({
  type: 'default',
  price: 'default',
  features: 'default',
  is_daily_payment: [],
  location: [],
  rooms: []
})

const propertyStore = usePropertyStore()
const { properties } = storeToRefs(propertyStore)
const { loadProperties } = propertyStore

onMounted(() => {
  loadProperties([]).then(response => {
    console.log("properties=", properties.value)
  }).catch(error => {
    console.error("Ошибка:", error)
  })
})
</script>

<style lang="css" scoped>
.main-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.search { 
    display: flex;
    gap: 10px;
    width: 100%;
    margin-bottom: 25px; 
}

.search input {
    padding: 12px; 
    border-radius: 10px; 
    border: 1px solid var(--border-main); 
    width: 100%;
}

.search button {
    display: flex;
    gap: 10px;
    background: var(--green-accent); 
    color: var(--bg-surface); 
    border: none;
    padding: 12px 20px;     
    border-radius: 10px; 
    cursor: pointer; 
    font-size: 16px;
}

.search-icon {
    width: 24px;
    height: 24px;
    fill: var(--green-accent);
    display: inline-block;
}

.search button:hover { background: var(--green-btn-hover); }

.filters {
    display: flex;
    flex-direction: column;
    justify-content: first baseline;
    background: var(--bg-surface);
    border-radius: 5px;
    border: 1px solid var(--border-main);
    width: calc(25% - 12px);
    position: sticky;
    top: 75px; 
    max-height: calc(100vh - 100px);
    overflow-y: auto;
}

.filter {
    padding-left: 10px;
    padding-bottom: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    font-size: 14px;
    cursor: pointer;
}

.filter select {
    padding: 5px;
    border-radius: 5px; 
    border: 1px solid var(--border-main);
    width: calc(100% - 20px)
}

.filter label, h3 {
    margin: 5px 0 5px 0;
    color: var(--green-main); 
}

.filter input[type="checkbox"] {
    margin-left: 10px;
    margin-bottom: 8px;
    border-radius: 5px;
    cursor: pointer;
    accent-color: var(--green-accent); ;
}

.apply-btn {
    width: 100%;
    padding: 10px 20px;
    margin-top: auto;
    background: var(--green-accent); ; 
    color: var(--bg-surface);
    border:none; 
    border-radius: 0 0 5px 5px; 
    font-size: 16px; 
    cursor: pointer;
}

.cards { 
    width: 75%;
    display: flex; 
    flex-direction: column; 
    gap: 20px; 
}
</style>
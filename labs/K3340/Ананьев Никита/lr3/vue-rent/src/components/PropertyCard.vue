<template>
<div class="card">
    <img
        :src="`/images/${(property.feed_img) ? property.feed_img : DEFAULT_PICTURE}`"
        :alt="`list image of ${property.address}`"
    />

    <div class="card-info">
        <div class="price">
            {{ property.price }} ₽ / {{ property.is_daily_payment ? 'день' : 'месяц' }}
        </div>

        <div class="address">
            <router-link :to="`/property/${property.id}`" class="card-link">
                {{ property.address }}
            </router-link>
        </div>

        <p class="limited-text">
            {{ property.area }} м², {{ property.rooms }} {{ getRoomsWord(property.rooms) }}
            <span v-if="property.floor">, {{ property.floor }}-й этаж</span>
            <br>
            {{ property.description }}
        </p>
    </div>
</div>
</template>

<script setup>
const props = defineProps({
    property: {
        type: Object
    }
})

const DEFAULT_PICTURE = 'stock.webp'

const getRoomsWord = (rooms) => {
    if (rooms >= 5) return 'комнат'
    if (rooms === 1) return 'комната'
    return 'комнаты'
}
</script>

<style lang="css" scoped>
.card {
    display: flex;
    flex-direction: row;
    background: var(--bg-surface);
    border: 1px solid var(--border-main);
    border-radius: 5px;
    overflow: hidden;
    margin-left: 10px;
}

.card img {
    width: 360px;
    height: 240px;
    object-fit: cover;
}

.card-info {
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-link {
    text-decoration: none;
    color: var(--green-main);
    font-size: 16px;
    background: none;
    border: none;
    cursor: pointer;
}

.card-link:hover { color: var(--green-hover); }

.price {
    font-size: 20px;
    color: var(--green-main);
    font-weight: bold;
}

.limited-text {
    max-width: 50ch;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text-main);
}
</style>

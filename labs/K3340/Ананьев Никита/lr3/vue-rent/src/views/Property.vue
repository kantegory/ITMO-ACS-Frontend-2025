<template>
<AllIcons/>
<Header/>
<main>
    <Loader v-if="isLoading"/>
    <Error v-else-if="error.notFound" :code="404"/>
    <Error v-else-if="error.server" :code="500"/>
    <div v-else class="container mt-4">
        <div id="carousel" class="carousel slide mb-4">
            <div id="carouselInner" class="carousel-inner">
                <div v-for="(image, i) in property.images" :class="['carousel-item', { active: i === 0 }]">
                    <img :alt="`image ${i + 1} of ${property.address}`" :src="`/images/${image}`" class="d-block w-100">
                </div>
            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev" title="previous">
                <span class="carousel-control-prev-icon"></span>
            </button>

            <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next" title="next">
                <span class="carousel-control-next-icon"></span>
            </button>
        </div>

        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start mb-2">
            <div id="propertyTitle" class="property-title skeleton">
                {{ property.title }}
            </div>
            <div id="propertyPrice" class="price mt-2 mt-md-0 skeleton">
                {{ property.price }} ₽ / {{ property.is_daily_payment ? 'день' : 'месяц' }}
            </div>
        </div>

        <div id="propertyAddress" class="text-muted mb-4">
            <svg class="icon">
                <use href="#icon-address"></use>
            </svg>
            {{ property.address }} 
        </div>

        <div class="row">
            <div class="col-md-7">
                <div id="propertySpecs" class="info-box specs-skeleton">
                    <h5 class="mb-3">Характеристики</h5>
                    <p><b>Площадь:</b> {{ property.area }} м²</p>
                    <p><b>Этаж:</b> {{ floor }}</p>
                    <p><b>Тип:</b> {{ typeMapper.get(property.type) }}</p>
                    <p><b>Комнат:</b> {{ property.rooms }}</p>
                    <p><b>Расположение:</b> Рядом с метро</p>
                    <p><b>Особенности:</b> С балконом, с животными</p>
                </div>
                <div id="propertyDescription" class="info-box desc-skeleton">
                    <h5 class="mb-3">Описание</h5> {{property.description}}
                </div>
            </div>

            <div class="col-md-5">
                <div id="landlordInfo" class="info-box contact-box owner-skeleton">
                    <h5 v-if="landLordErrMessage" class="error-text">{{ landLordErrMessage }}</h5>

                    <template v-else>
                        <h5 class="mb-3">Контакты владельца</h5>

                        <p>{{ landlordInfo.name }}</p>
                        <p>
                            <svg class="icon">
                                <use href="#icon-phone"></use>
                            </svg> 
                            {{ landlordInfo.phone}}
                        </p>
                        <p>
                            <svg class="icon">
                                <use href="#icon-email"></use>
                            </svg> 
                            {{ landlordInfo.email }}
                        </p>

                        <button>Написать владельцу</button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</main>
<Footer/>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Error from '@/components/Error.vue';
import Loader from '@/components/Loader.vue';
import AllIcons from '@/components/icons/AllIcons.vue';
import useUserStore from '@/stores/userStorage';
import { usePropertyStore, PropertyNotFound} from '@/stores/propertyStorage';
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const { loadUserById } = userStore

const propertyStore = usePropertyStore()
const { loadSingleProperty } = propertyStore

const route = useRoute()

const property = reactive({
    id: 0,
    owner_id: 0,
    type: '',
    title: '',
    description: '',
    price: 0,
    is_daily_payment: false,
    address: '',
    feed_img: '',
    images: [],
    rooms: 0,
    floor: 0,
    area: 0
})

const landlordInfo = reactive({
    name: 'Нет имени',
    email: 'email не указан',
    phone: 'телефон не указан',
})

const landLordErrMessage = ref('');

const typeMapper = new Map([
    ["flat", "Квартира"], 
    ["house", "Дом"], 
    ["room", "Комната"],
    ["garage", "Гараж"]
])

const isLoading = ref(false)
const error = reactive({
    notFound: false,
    server: false,
})

async function loadLandlord(landlordId) {
    try {
        const landlordData = await loadUserById(landlordId)
        Object.assign(landlordInfo, landlordData)
    } catch (e) {
        console.log("ERROR:", e)
        landLordErrMessage.value = "Ошибка загрузки данных арендодателя. Попробуйте позже"
    }
}

onMounted(async () => {
    // загружаем данные основной страницы
    try {
        isLoading.value = true
        const propertyData = await loadSingleProperty(route.params.propertyId)
        Object.assign(property, propertyData)
    } catch (e) {
        console.log(e)
        if (e instanceof PropertyNotFound) {
            error.notFound = true
        } else {
            error.server = true
        }
    } finally {
        isLoading.value = false
    }

    // подгружаем данные арендодателя
    if (property.owner_id) {
        await loadLandlord(property.owner_id)
    } else {
        landLordErrMessage.value = "Арендодетель не найден. Попробуйте позже"
    }
})
</script>

<style lang="css" scoped>
@import 'bootstrap/dist/css/bootstrap.min.css';

#carousel {
    aspect-ratio: 2 / 1;
}

.carousel-inner,
.carousel-inner img {
    height: 100%;
    border-radius: 20px;
}

.property-title {
    font-size: 32px;
    font-weight: bold;
}

.price {
    color: var(--green-main);
    font-size: 28px;
    font-weight: bold;
}

.info-box {
    background: var(--bg-surface);
    border: 1px solid var(--info-border);
    border-radius: 15px;
    padding: 20px 25px;
    margin-bottom: 25px;
}

.contact-box button {
    width: 100%;
    background: var(--btn-contact);
    border: none;
    padding: 14px;
    font-size: 18px;
    color: var(--bg-surface);
    border-radius: 10px;
}

.contact-box button:hover {
    background: var(--btn-contact-hover);
}

.text-muted {
    color: var(--text-muted) !important;
}

.specs-skeleton {
    min-height: 200px;
}

.owner-skeleton {
    min-height: 200px;
}

.desc-skeleton {
    min-height: 120px;
}

.error-text {
    color: brown;
}
</style>
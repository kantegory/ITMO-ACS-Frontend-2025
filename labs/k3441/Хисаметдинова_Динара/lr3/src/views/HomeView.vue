<template>
  <main role="main">
    <section class="hero-section">
      <div class="hero-overlay">
        <div class="container">
          <div class="row justify-content-center text-center text-white">
            <div class="col-lg-8">
              <h1 class="display-4 fw-bold mb-3">Explore Eastern Europe</h1>
              <p class="lead mb-5">Find unique stays across the most underrated Post-Soviet regions</p>

              <SearchForm @search="handleSearch" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div class="row text-center mb-5">
          <div class="col-12">
            <h2 class="h1 mb-5">Why Us?</h2>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="feature-card text-center">
              <i class="fas fa-eye fa-3x text-primary mb-3"></i>
              <h3 class="text-primary">Know Exactly What You're Paying</h3>
              <p class="text-muted">Clear prices, great currency with zero hidden fees</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card text-center">
              <i class="fas fa-shield-alt fa-3x text-primary mb-3"></i>
              <h3 class="text-primary">Locally Verified, Globally Trusted</h3>
              <p class="text-muted">Every property checked by our local teams - no surprises on arrival</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card text-center">
              <i class="fas fa-handshake fa-3x text-primary mb-3"></i>
              <h3 class="text-primary">Finally, Hassle-Free Booking</h3>
              <p class="text-muted">No more language barriers, cash-only services and conflicts with babushkas. Just click and book a stay.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5" id="deals">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="h1 mb-0">Deals for the Weekend</h2>
          <div>
            <button class="btn btn-outline-secondary rounded-circle" @click="previousDeals" aria-label="View previous deals">
              <i class="fas fa-chevron-left" aria-hidden="true"></i>
            </button>
            <button class="btn btn-outline-secondary rounded-circle ms-2" @click="nextDeals" aria-label="View next deals">
              <i class="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <PropertyList :properties="weekendDeals" />
      </div>
    </section>

    <TravelBenefits />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApiService } from '@/composables/useApiService'
import { type Property } from '@/types'
import SearchForm from '@/components/SearchForm.vue'
import PropertyList from '@/components/PropertyList.vue'
import TravelBenefits from '@/components/TravelBenefits.vue'

const router = useRouter()
const { apiService } = useApiService()

const weekendDeals = ref<Property[]>([])

onMounted(async () => {
  const response = await apiService.getProperties()
  if (response.success && response.data) {
    weekendDeals.value = response.data.slice(0, 4)
  }
})

const handleSearch = (searchData: any) => {
  const query: any = {
    location: searchData.location || '',
    checkIn: searchData.checkIn || '',
    checkOut: searchData.checkOut || '',
    guests: searchData.guests || '1'
  }

  if (searchData.useLocation && searchData.coordinates) {
    query.useLocation = 'true'
    query.latitude = searchData.coordinates.latitude.toString()
    query.longitude = searchData.coordinates.longitude.toString()

    if (searchData.locationInfo) {
      query.city = searchData.locationInfo.city
      query.country = searchData.locationInfo.country
    }
  }

  router.push({
    name: 'search',
    query
  })
}

const previousDeals = () => {
  console.log('Previous deals')
}

const nextDeals = () => {
  console.log('Next deals')
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(var(--hero-overlay), var(--hero-overlay)), url('/images/hero.webp') center/cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
}

.hero-overlay {
  padding-top: 100px;
  width: 100%;
}

.display-4 {
  font-size: 3.5rem;
  font-weight: 300;
  margin-bottom: 1rem;
}

.lead {
  font-size: 1.25rem;
  font-weight: 300;
}

.feature-card {
  padding: 2rem 1rem;
}
</style>
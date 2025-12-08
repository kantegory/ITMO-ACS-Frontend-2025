<template>
  <section class="py-5 bg-light">
    <div class="container">
      <h2 class="h1 text-center mb-5">Travel more, spend less</h2>
      <div class="row g-4">
        <div class="col-md-3">
          <div class="benefit-card card border-0 bg-transparent h-100">
            <div class="card-body text-center d-flex flex-column">
              <div class="d-flex justify-content-center mb-3">
                <IconCoins class="text-primary benefit-icon" :width="48" :height="48" />
              </div>
              <h3>No Foreign Transaction Fees</h3>
              <p class="text-muted flex-grow-1">Pay in local currency or yours - we handle conversion at bank rates, not tourist rates</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="benefit-card card border-0 bg-transparent h-100">
            <div class="card-body text-center d-flex flex-column">
              <div class="d-flex justify-content-center mb-3">
                <IconCalendar class="text-primary benefit-icon" :width="48" :height="48" />
              </div>
              <h3>Travel off season</h3>
              <p class="text-muted flex-grow-1">Avoid peak times this spring enjoy lower and fewer crowds</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="benefit-card card border-0 bg-transparent h-100">
            <div class="card-body text-center d-flex flex-column">
              <div class="d-flex justify-content-center mb-3">
                <IconSale class="text-primary benefit-icon" :width="48" :height="48" />
              </div>
              <h3>Exclusive deals</h3>
              <p class="text-muted flex-grow-1">Enjoy discounts at participating properties worldwide</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="benefit-card card border-0 bg-transparent h-100">
            <div class="card-body text-center d-flex flex-column">
              <div class="d-flex justify-content-center mb-3">
                <IconSnooze class="text-primary benefit-icon" :width="48" :height="48" />
              </div>
              <h3>Weekend Special</h3>
              <p class="text-muted flex-grow-1">Be happy with 12% off weekend stays</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import IconCoins from '@/components/icons/IconCoins.vue'
import IconCalendar from '@/components/icons/IconCalendar.vue'
import IconSale from '@/components/icons/IconSale.vue'
import IconSnooze from '@/components/icons/IconSnooze.vue'
</script>

<style scoped>
.bg-light {
  background-color: #f8f9fa !important;
}

.benefit-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 10px;
  min-height: 250px;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.8) !important;
}

[data-theme="dark"] .benefit-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.benefit-card:hover .benefit-icon {
  transform: scale(1.1);
}

.benefit-icon {
  transition: transform 0.3s ease;
}

.benefit-card h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.benefit-card p {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-muted);
}

[data-theme="dark"] .benefit-card h3 {
  color: #e9ecef !important;
}

[data-theme="dark"] .benefit-card p {
  color: #ced4da !important;
}

.card-body {
  padding: 2rem 1.5rem;
}
</style>
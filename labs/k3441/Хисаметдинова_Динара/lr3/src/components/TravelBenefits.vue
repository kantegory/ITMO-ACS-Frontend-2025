<template>
  <section class="py-5 bg-light">
    <div class="container">
      <h2 class="h1 text-center mb-5">Travel more, spend less</h2>
      <div class="row g-4">
        <div class="col-md-3">
          <div class="card border-0 bg-transparent">
            <div class="card-body text-center">
              <div class="d-flex justify-content-center mb-3">
                <IconCoins class="text-primary" :width="48" :height="48" />
              </div>
              <h3>No Foreign Transaction Fees</h3>
              <p class="text-muted">Pay in local currency or yours - we handle conversion at bank rates, not tourist rates</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 bg-transparent">
            <div class="card-body text-center">
              <div class="d-flex justify-content-center mb-3">
                <IconCalendar class="text-primary" :width="48" :height="48" />
              </div>
              <h3>Travel off season</h3>
              <p class="text-muted">Avoid peak times this spring enjoy lower and fewer crowds</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 bg-transparent">
            <div class="card-body text-center">
              <div class="d-flex justify-content-center mb-3">
                <IconSale class="text-primary" :width="48" :height="48" />
              </div>
              <h3>Exclusive deals</h3>
              <p class="text-muted">Enjoy discounts at participating properties worldwide</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 bg-transparent">
            <div class="card-body text-center">
              <div class="d-flex justify-content-center mb-3">
                <IconSnooze class="text-primary" :width="48" :height="48" />
              </div>
              <h3>Weekend Special</h3>
              <p class="text-muted">Be happy with 12% off weekend stays</p>
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
</style>
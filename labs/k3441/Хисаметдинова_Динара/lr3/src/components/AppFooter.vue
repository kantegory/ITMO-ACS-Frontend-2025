<template>
  <footer class="bg-dark text-white py-5 mt-auto" role="contentinfo">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-4">
          <h3 class="mb-3">RentAparts</h3>
          <p class="text-muted">Discover unique accommodations across Eastern Europe. From Soviet-era apartments to modern lofts, find your perfect stay.</p>
        </div>
        <div class="col-lg-2">
          <h4 class="mb-3 footer-heading">Company</h4>
          <ul class="list-unstyled">
            <li><a href="#" class="footer-link text-decoration-none">About</a></li>
            <li><a href="#" class="footer-link text-decoration-none">Careers</a></li>
            <li><a href="#" class="footer-link text-decoration-none">Press</a></li>
            <li><a href="#" class="footer-link text-decoration-none">Blog</a></li>
          </ul>
        </div>
        <div class="col-lg-2">
          <h4 class="mb-3 footer-heading">Support</h4>
          <ul class="list-unstyled">
            <li><a href="#" class="footer-link text-decoration-none">Help Center</a></li>
            <li><a href="#" class="footer-link text-decoration-none">Contact Us</a></li>
            <li><a href="#" class="footer-link text-decoration-none">Safety</a></li>
          </ul>
        </div>
        <div class="col-lg-2">
          <h4 class="mb-3 footer-heading">Community</h4>
          <ul class="list-unstyled">
            <li><a href="#" class="footer-link text-decoration-none">Guidelines</a></li>
            <li><a href="#" class="footer-link text-decoration-none">Reviews</a></li>
            <li><a href="#" class="footer-link text-decoration-none">Host</a></li>
          </ul>
        </div>
        <div class="col-lg-2">
          <h4 class="mb-3 footer-heading">Follow Us</h4>
          <div class="d-flex gap-2">
            <a href="#" class="footer-link" aria-label="Follow us on Facebook">
              <i class="fab fa-facebook" aria-hidden="true"></i>
            </a>
            <a href="#" class="footer-link" aria-label="Follow us on Twitter">
              <i class="fab fa-twitter" aria-hidden="true"></i>
            </a>
            <a href="#" class="footer-link" aria-label="Follow us on Instagram">
              <i class="fab fa-instagram" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
      <hr class="my-4">
      <div class="text-center text-muted">
        <p>&copy; 2025 RentAparts.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
footer {
  background-color: #212529 !important;
}

.footer-heading {
  color: #f5deb3; 
  font-weight: 500;
}

.footer-link {
  color: #f5deb3; 
  transition: color 0.3s ease;
  opacity: 0.8;
}

.footer-link:hover {
  color: #fff;
  opacity: 1;
  text-decoration: underline !important;
}

.footer-link i {
  font-size: 1.2rem;
}

ul li {
  margin-bottom: 0.5rem;
}
</style>
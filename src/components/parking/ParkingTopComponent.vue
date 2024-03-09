<template>
  <div class="container mx-auto my-3 border border-success-subtle border-2 rounded-4">
    <nav class="navbar navbar-expand nav-fill" aria-label="main-footer-bar">
      <div class="container">
        <router-link class="navbar-brand" to="/parking"
                     style="--bs-navbar-brand-font-size: 1.5rem">Parking-system
        </router-link>
        <button type="button" class="btn btn-secondary btn-sm" data-bs-toggle="modal"
                data-bs-target="#staticLogoutBackdrop" style="--bs-btn-bg: #b5e1b7; --bs-btn-color: #000000">
          Logout
        </button>
      </div>
    </nav>
  </div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>

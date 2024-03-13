<script setup>
import { handelLogout } from '@/scripts/modal_scripts.js'
import { c_binds, cookies } from '@/assets/config/cookies.js'
import router from '@/router/index.js'
import { useToast } from 'vue-toastification'

const toast = useToast()

async function processLogout() {
  await handelLogout()
  cookies.remove(c_binds.auth_token)
  toast.success("Log out successfully")
  await router.push("/login")
}

</script>

<template>
  <div class="modal fade" id="staticLogoutBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"
       tabindex="-1" aria-labelledby="staticLogoutBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticLogoutBackdropLabel">Logout</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="lh-1">
            <p class="text-start">Are you sure ?</p>
            <p class="text-start">
              <span>Do you want to </span>
              <span class="text-danger">logout </span>
              <span>?</span>
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
          <button type="button" id="logoutButton" class="btn btn-danger" data-bs-dismiss="modal" @click="processLogout">Yes, logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>

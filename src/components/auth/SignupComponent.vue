<script setup>
import { handleRegister, usernameCheck, validateAuthForm } from '@/scripts/auth_scripts.js'
import { setInvalid, setValid } from '@/scripts/html_scripts.js'
import { RegisterDto } from '@/data/structures.ts'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import router from '@/router/index.js'
import { checkErrorResponse } from '@/scripts/rest_scripts.js'

const fullName = ref('')
const username = ref('')
const password = ref('')
const toast = useToast()
const showPassword = ref(false)
const errorMessage = ref({})

async function submit() {
  const dto = new RegisterDto(fullName.value, username.value, password.value)
  const isValidForm = validateForm(dto)

  if (isValidForm) {
    const isUsernameExists = await usernameCheck(username.value)
    if (isUsernameExists) {
      setInvalid('usernameInput')
      toast.error(`User with username: "${username.value}" already exists`)
      return
    }

    let response = await handleRegister(dto)
    checkErrorResponse(response.error, 'Failed to login')
    if (response.error !== null) {
      toast.success(`User has been created!`)
      await router.push("/login")
    }
  }
}

function validateForm(dto) {
  const errMap = validateAuthForm(dto, false)
  errorMessage.value = errMap
  let isValid = true

  if (errMap.fullName !== null && errMap.fullName !== '') {
    setInvalid("fullNameInput")
    isValid = false
  }

  if (errMap.username !== null && errMap.username !== '') {
    setInvalid("usernameInput")
    isValid = false
  }

  if (errMap.password !== null && errMap.password !== '') {
    setInvalid("passwordInput")
    isValid = false
  }

  return isValid
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}
</script>


<template>
  <body class="display-xy-centered">
  <div class="card border border-2 rounded rounded-4">
    <div class="card-header">
      <h3>Parking system signup</h3>
    </div>
    <div class="card-body">
      <form @submit.prevent="submit" class="has-validation" autocomplete="off">
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="fullNameInput"
            v-model="fullName"
            @click="setValid('fullNameInput')"
            placeholder="example full name"
          >
          <label for="fullNameInput">Full name</label>
          <div class="invalid-feedback">
            {{ errorMessage.fullName }}
          </div>
        </div>
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="usernameInput"
            autocomplete="off"
            v-model="username"
            @click="setValid('usernameInput')"
            placeholder="example_username"
          >
          <label for="usernameInput">Username</label>
          <div class="invalid-feedback">
            {{ errorMessage.username }}
          </div>
        </div>
        <div class="form-floating mb-3">
          <input
            :type="showPassword ? 'text' : 'password'"
            class="form-control password-form-control"
            id="passwordInput"
            v-model="password"
            @click="setValid('passwordInput')"
            placeholder="example_password"
          >
          <label for="passwordInput">Password</label>
          <div class="invalid-feedback">
            {{ errorMessage.password }}
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                   @click="togglePasswordVisibility">
            <label class="form-check-label" for="flexCheckDefault">
              Show the password
            </label>
          </div>
        </div>
        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-primary btn-lg mb-2">Create account</button>
        </div>
        <p class="fw-normal">Already have account? <router-link class="text-decoration-none" to="/login">Log in</router-link></p>
      </form>
    </div>
  </div>
  </body>
</template>

<style scoped>
@import "@/assets/auth-style.css";
@import "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css";
</style>

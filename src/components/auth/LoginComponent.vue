<script setup>
import { handleLogin, validateAuthForm } from '@/scripts/auth_scripts.js'
import { LoginDto } from '@/data/structures.ts'
import { cookies, c_binds } from '@/assets/config/cookies.js'
import { ref } from 'vue'
import router from '@/router/index.js'
import { useToast } from 'vue-toastification'
import { setInvalid, setValid } from '@/scripts/html_scripts.js'

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const token = ref('')
const toast = useToast()
const errorMessage = ref({})
const response = ref({error: null, token: null})

async function submit() {
  const dto = new LoginDto(username.value, password.value)
  if (validateForm(dto) === true) {
    return
  }
  response.value = await handleLogin(dto)
  if (response.value.error !== null) {
    toggleLoginFailed()
    return
  }
  token.value = response.value.token
  cookies.set(c_binds.auth_token, token.value, { sameSite: 'lax' })
  toast.success(`Login successfully`)
  await router.push('/parking')
}

function validateForm(dto) {
  const errMap = validateAuthForm(dto, true)
  errorMessage.value = errMap
  let invalid = false
  if (errMap.username !== null && errMap.username !== '') {
    setInvalid("usernameInput")
    invalid = true
  }
  if (errMap.password !== null && errMap.password !== '') {
    setInvalid("passwordInput")
    invalid = true
  }
  return invalid
}

function toggleLoginFailed() {
  toast.error(response.value.error)
  errorMessage.value = {
    username: "Invalid username",
    password: "Invalid password"
  }
  setInvalid("usernameInput")
  setInvalid("passwordInput")
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <body class="display-xy-centered">
  <div class="card border border-2 rounded rounded-4">
    <div class="card-header">
      <h3>Parking system login</h3>
    </div>
    <div class="card-body">
      <form @submit.prevent="submit" class="has-validation">
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
          <button type="submit" class="btn btn-primary btn-lg mb-2">login</button>
        </div>
        <p class="fw-normal">
          Not registered? <router-link class="text-decoration-none" to="/signup">Create an account</router-link>
        </p>
      </form>
    </div>
  </div>
  </body>
</template>

<style scoped>
@import "@/assets/auth-style.css";
</style>

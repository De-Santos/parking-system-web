import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import store from '@/vuex'
import Toast from 'vue-toastification'
import { config } from '@/assets/config/toast_config.js'
import 'vue-toastification/dist/index.css'
import '@/assets/config/axios_config.js'
import Vue3Geolocation from 'vue3-geolocation'

import createBootstrap from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(store)
app.use(Toast, config)
app.use(Vue3Geolocation)
app.use(createBootstrap({components: true, directives: true})) // Change this line

app.mount('#app')

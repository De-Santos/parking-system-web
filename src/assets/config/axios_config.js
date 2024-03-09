import axios from 'axios'
import { c_binds, cookies } from '@/assets/config/cookies.js'

axios.defaults.baseURL = import.meta.env.VITE_BACK_HOST

export function syncAuth() {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + cookies.get(c_binds.auth_token)
}

syncAuth()

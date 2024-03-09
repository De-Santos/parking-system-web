import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '@/components/auth/LoginComponent.vue'
import ParkingComponent from '@/components/parking/ParkingComponent.vue'
import SignupComponent from '@/components/auth/SignupComponent.vue'
import { c_binds, cookies } from '@/assets/config/cookies.js'
import { useToast } from 'vue-toastification'

const authRequiredBeforeEnter = (to, from, next) => {
  const token = cookies.get(c_binds.auth_token)
  const toast = useToast()
  if (!token) {
    toast.error("You're unauthorized, please login")
    next('/login')
  } else {
    next()
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/parking',
      name: 'parking',
      component: ParkingComponent,
      beforeEnter: authRequiredBeforeEnter
    },
    {
      path: '/login',
      name: 'login',
      component: LoginComponent
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupComponent
    }
  ]
})

export default router

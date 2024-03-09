import { c_binds, cookies } from '@/assets/config/cookies.js'
import router from '@/router/index.js'
import { useToast } from 'vue-toastification'

export function checkErrorResponse(axiosError, errMsg) {
  const toast = useToast()
  if (axiosError !== null) {
    toast.error(errMsg)
    if (axiosError.response.status === 401) {
      cookies.remove(c_binds.auth_token)
      router.push('/login').catch(err => {
        console.log(err)
      })
    }
  }

}

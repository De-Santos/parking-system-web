import axios from 'axios'

import bootstrap from 'bootstrap/js/index.umd.js'
import { syncAuth } from '@/assets/config/axios_config.js'

export async function handelLogout() {
  syncAuth()
  axios.post('/logout')
    .catch(er => {
      console.log(er)
    })
}

export function loadModal(id) {
  const myModal = new bootstrap.Modal(document.getElementById(id))
  myModal.show()
}


export async function deleteParking(id) {
    syncAuth()
    const response = {
      error: null,
    }
    try {
      await axios.delete(`/parking?id=${id}`)
    } catch (e) {
      response.error = e
    }
    return response
}

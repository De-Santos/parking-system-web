import axios from 'axios'

import bootstrap from 'bootstrap/js/index.umd.js'

export async function handelLogout() {
  axios.post('/logout')
    .catch(er => {
      console.log(er)
    })
}

export function loadModal(id) {
  const myModal = new bootstrap.Modal(document.getElementById(id))
  myModal.show()
}

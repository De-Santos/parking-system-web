import axios from 'axios'
import { c_binds, cookies } from '@/assets/config/cookies.js'


export async function fetchParkingList(sq) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + cookies.get(c_binds.auth_token)
  const response = {
    error: null,
    data: []
  }
  try {
    let r = await axios.get(`/parking?limit=${sq.limit}&page=${sq.page}&search_text=${sq.search_text}`)
    response.data = r.data
  } catch (e) {
    response.error = e
  }
  return response
}

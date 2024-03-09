import axios from 'axios'
import { syncAuth } from '@/assets/config/axios_config.js'

export async function fetchParkingList(sq) {
  syncAuth()
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

export async function saveUpdatedParkingData(upd) {
  syncAuth()
  const response = {
    error: null,
    data: null,
  }
  try {
    const r = await axios.put('/parking', upd)
    response.data = r.data
  } catch (e) {
    response.error = e
  }
  return response
}

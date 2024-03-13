import { syncAuth } from '@/assets/config/axios_config.js'
import { CarResponseHolder } from '@/data/structures.ts'
import axios from 'axios'

export async function fetchCarList(sq) {
  syncAuth()
  const response = new CarResponseHolder(null, { body: [], limit: 0, page: 1, total_rows: 0, total_pages: 1 })
  try {
    let r = await axios.get(`/cars?limit=${sq.limit}&page=${sq.page}&search_text=${sq.search_text}&sb=${sq.sb}&c=${sq.c}`)
    response.data = r.data
  } catch (e) {
    response.error = e
  }
  return response
}

export async function saveCar(data) {
  syncAuth()
  const response = {
    error: null,
    data: null
  }
  try {
    const r = await axios.post('/car', data)
    response.data = r.data
  } catch (e) {
    response.error = e
  }
  return response
}

export async function deleteCar(id) {
  syncAuth()
  const response = {
    error: null
  }
  try {
    await axios.delete(`/car?id=${id}`)
  } catch (e) {
    response.error = e
  }
  return response
}

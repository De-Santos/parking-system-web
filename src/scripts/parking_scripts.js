import axios from 'axios'
import { syncAuth } from '@/assets/config/axios_config.js'
import { ParkingResponseHolder } from '@/data/structures.ts'

export async function fetchParkingList(sq) {
  syncAuth()
  const response = new ParkingResponseHolder(null, { body: [], limit: 0, page: 1, total_rows: 0, total_pages: 1})
  try {
    let r = await axios.get(`/parking?limit=${sq.limit}&page=${sq.page}&search_text=${sq.search_text}&sb=${sq.sb}`)
    response.data = r.data
  } catch (e) {
    response.error = e
  }
  return response
}

export async function saveUpdatedParkingData(data) {
  syncAuth()
  const response = {
    error: null,
    data: null,
  }
  try {
    const r = await axios.put('/parking', data)
    response.data = r.data
  } catch (e) {
    response.error = e
  }
  return response
}

export async function saveParking(data) {
  syncAuth()
  const response = {
    error: null,
    data: null,
  }
  try {
    const r = await axios.post('/parking', data)
    response.data = r.data
  } catch (e) {
    response.error = e
  }
  return response
}

export async function fetchParking(id){
  syncAuth()
  const response = {
    data: null,
    error: null
  }
  try {
    let r = await axios.get(`/a-parking?id=${id}`)
    response.data = r.data
  } catch (e) {
    response.error = e
  }
  return response
}

import { AxiosError } from 'axios'

export class LoginDto {
  username: string
  password: string

  constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }
}

export class RegisterDto {
  full_name: string
  username: string
  password: string

  constructor(full_name: string, username: string, password: string) {
    this.full_name = full_name
    this.username = username
    this.password = password
  }
}

export class Coordinates {
  lat: number
  lng: number

  constructor(lat: number, lng: number) {
    this.lat = lat
    this.lng = lng
  }
}

export class ParkingDto {
  id: number
  parking_name: string
  owner: string
  address: string
  capacity: number
  coordinates: Coordinates
  created_by: string
  created_at: Date

  constructor(id: number, parking_name: string, owner: string, address: string, capacity: number, coordinates: Coordinates, created_by: string, created_at: Date) {
    this.id = id
    this.parking_name = parking_name
    this.owner = owner
    this.address = address
    this.capacity = capacity
    this.coordinates = coordinates
    this.created_by = created_by
    this.created_at = created_at
  }
}

export class UpdateParkingDto {
  id: number
  parking_name: string
  owner: string
  address: string
  capacity: number
  coordinates: Coordinates

  constructor(id: number, parking_name: string, owner: string, address: string, capacity: number, coordinates: Coordinates) {
    this.id = id
    this.parking_name = parking_name
    this.owner = owner
    this.address = address
    this.capacity = capacity
    this.coordinates = coordinates
  }
}

export class SearchDto {
  limit: number
  page: number
  search_text: string
  c: number

  constructor(limit: number, page: number, search_text: string, c: number) {
    this.limit = limit
    this.page = page
    this.search_text = search_text
    this.c = c
  }
}

export class ParkingResponseHolder {
  error: string | AxiosError
  data: {
    body: ParkingDto[];
    limit: number;
    page: number;
  }

  constructor(error: string | null, data: { body: ParkingDto[]; limit: number; page: number }) {
    this.error = error
    this.data = data
  }
}

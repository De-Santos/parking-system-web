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
export class CarDto {
  id: number
  vrp: string
  arrived: Date | string
  expiration: Date | string
  parking_id: number

  constructor(id: number, vpr: string, arrived: Date | string, expiration: Date | string, parking_id: number) {
    this.id = id
    this.vrp = vpr
    this.arrived = arrived
    this.expiration = expiration
    this.parking_id = parking_id
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
  sb: string

  constructor(limit: number, page: number, search_text: string, c: number, sb: string) {
    this.limit = limit
    this.page = page
    this.search_text = search_text
    this.c = c
    this.sb = sb
  }
}

export class ParkingResponseHolder {
  error: string | AxiosError
  data: {
    body: ParkingDto[]
    limit: number
    page: number
    total_rows: number
    total_pages: number
  }

  constructor(error: string | AxiosError, data: {
    body: ParkingDto[];
    limit: number;
    page: number;
    total_rows: number;
    total_pages: number
  }) {
    this.error = error
    this.data = data
  }
}

export class CarResponseHolder {
  error: string | AxiosError
  data: {
    body: CarDto[]
    limit: number
    page: number
    total_rows: number
    total_pages: number
  }

  constructor(error: string | AxiosError, data: {
    body: CarDto[];
    limit: number;
    page: number;
    total_rows: number;
    total_pages: number
  }) {
    this.error = error
    this.data = data
  }
}

export class PaginationDataHolder {
  limit: number = null
  page: number = null
  total_rows: number = null
  total_pages: number = null

  private constructor() {
  }

  static empty() {
    let p =  new PaginationDataHolder()
    p.limit = 2
    p.page = 1
    return p
  }

  static new(limit: number, page: number, total_rows: number, total_pages: number) {
    let p = this.empty()
    p.limit = limit
    p.page = page
    p.total_rows = total_rows
    p.total_pages = total_pages
    return p
  }

  static of(c: ParkingResponseHolder | CarResponseHolder) {
    if (c.error != null) throw new DOMException()
    return this.new(c.data.limit, c.data.page, c.data.total_rows, c.data.total_pages)
  }
}

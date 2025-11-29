export interface Amenity {
  area_level: string
  area_name: string
  category: string
  lat: number
  lon: number
  name: string
}

export interface AmenitiesResponse {
  results?: Amenity[]
  [key: string]: unknown
}



export interface PropertyAddress {
  sa1?: string
  sal?: string
  state?: string
  street?: string
}

export interface PropertyAttributes {
  bathrooms?: number
  bedrooms?: number
  building_size?: string
  description?: string
  garage_spaces?: number
  land_size?: string
}

export interface PropertyCoordinates {
  latitude?: number
  longitude?: number
}

export interface Property {
  address?: PropertyAddress
  area_level?: string
  area_name?: string
  attributes?: PropertyAttributes
  coordinates?: PropertyCoordinates
  gnaf_pid?: string
  listing_date?: string
  price?: number
  property_type?: string
  [key: string]: unknown
}

export interface ApiResponse {
  results?: Property[]
  [key: string]: unknown
}



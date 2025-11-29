import type { Property, ApiResponse } from '../types/property'
import type { Amenity, AmenitiesResponse } from '../types/amenity'
import type { StreetMarketInsight, MarketInsightsResponse } from '../types/marketInsights'

// Use production API endpoint
const isDevelopment = import.meta.env.DEV
const API_BASE_URL = isDevelopment
  ? '/api/suburb'
  : 'https://www.microburbs.com.au/report_generator/api/suburb'
  

export async function fetchProperties(suburb: string): Promise<Property[]> {
  try {
    if (!suburb || suburb.trim() === '') {
      throw new Error('Suburb is required')
    }

    const url = `${API_BASE_URL}/properties?suburb=${encodeURIComponent(suburb)}`
    console.log('Fetching properties from:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test',
        'Content-Type': 'application/json',
      },
    })

    console.log('Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error response:', errorText)
      
      if (response.status === 401) {
        let errorMessage = 'Error.'
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch {
          // Use default message if parsing fails
        }
        throw new Error(errorMessage)
      }
      
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data: ApiResponse = await response.json()
    console.log('Properties data received:', data)
    
    // Handle response structure - API returns { results: [...] }
    if (data.results && Array.isArray(data.results)) {
      console.log(`Found ${data.results.length} properties`)
      return data.results
    }
    
    // Fallback for other structures
    if (Array.isArray(data)) {
      return data as Property[]
    }
    if (data.properties && Array.isArray(data.properties)) {
      return data.properties
    }
    if (data.data && Array.isArray(data.data)) {
      return data.data
    }
    
    console.warn('No properties found in response:', data)
    return []
  } catch (error) {
    console.error('Error fetching properties:', error)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to API. Please check your connection and try again.')
    }
    throw error
  }
}

export async function fetchAmenities(suburb: string): Promise<Amenity[]> {
  try {
    if (!suburb || suburb.trim() === '') {
      throw new Error('Suburb is required')
    }

    const url = `${API_BASE_URL}/amenity?suburb=${encodeURIComponent(suburb)}`
    console.log('Fetching amenities from:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test',
        'Content-Type': 'application/json',
      },
    })

    console.log('Amenities response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error response:', errorText)
      
      if (response.status === 401) {
        let errorMessage = 'Unauthorized: Sandbox token only works with demo suburbs.'
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch {
          // Use default message if parsing fails
        }
        throw new Error(errorMessage)
      }
      
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data: AmenitiesResponse = await response.json()
    console.log('Amenities data received:', data)
    
    // Handle response structure - API returns { results: [...] }
    if (data.results && Array.isArray(data.results)) {
      console.log(`Found ${data.results.length} amenities`)
      return data.results
    }
    
    // Fallback for other structures
    if (Array.isArray(data)) {
      return data as Amenity[]
    }
    
    console.warn('No amenities found in response:', data)
    return []
  } catch (error) {
    console.error('Error fetching amenities:', error)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to API. Please check your connection and try again.')
    }
    throw error
  }
}

export async function fetchMarketInsights(suburb: string): Promise<StreetMarketInsight[]> {
  try {
    if (!suburb || suburb.trim() === '') {
      throw new Error('Suburb is required')
    }

    const url = `${API_BASE_URL}/streets?suburb=${encodeURIComponent(suburb)}`
    console.log('Fetching market insights from:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test',
        'Content-Type': 'application/json',
      },
    })

    console.log('Market insights response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error response:', errorText)
      
      if (response.status === 401) {
        let errorMessage = 'Unauthorized: Sandbox token only works with demo suburbs.'
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch {
          // Use default message if parsing fails
        }
        throw new Error(errorMessage)
      }
      
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data: MarketInsightsResponse = await response.json()
    console.log('Market insights data received:', data)
    
    // Handle response structure - API returns { results: [[...], [...]] }
    // Flatten the nested array structure
    if (data.results && Array.isArray(data.results)) {
      const flattened: StreetMarketInsight[] = []
      data.results.forEach((group) => {
        if (Array.isArray(group)) {
          flattened.push(...group)
        }
      })
      console.log(`Found ${flattened.length} market insights`)
      return flattened
    }
    
    console.warn('No market insights found in response:', data)
    return []
  } catch (error) {
    console.error('Error fetching market insights:', error)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to API. Please check your connection and try again.')
    }
    throw error
  }
}


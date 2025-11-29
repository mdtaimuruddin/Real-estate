import { useState, useEffect } from 'react'
import { fetchProperties, fetchAmenities, fetchMarketInsights } from './services/api'
import type { Property } from './types/property'
import type { Amenity } from './types/amenity'
import type { StreetMarketInsight } from './types/marketInsights'
import PropertyCard from './components/PropertyCard'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import SearchBar from './components/SearchBar'
import StatsBar from './components/StatsBar'
import AmenitiesPanel from './components/AmenitiesPanel'
import MarketInsightsPanel from './components/MarketInsightsPanel'

function App() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [marketInsights, setMarketInsights] = useState<StreetMarketInsight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAmenities, setIsLoadingAmenities] = useState(false)
  const [isLoadingMarketInsights, setIsLoadingMarketInsights] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('Belmont North')
  const [currentSuburb, setCurrentSuburb] = useState<string>('')
  const [priceFilter, setPriceFilter] = useState<string>('all')

  // Load default suburb on mount
  useEffect(() => {
    if (searchQuery.trim()) {
      loadProperties(searchQuery.trim())
    }
    
  }, [])

  const loadProperties = async (suburb: string) => {
    if (!suburb || suburb.trim() === '') {
      setError('Please enter a suburb name')
      return
    }

    setIsLoading(true)
    setIsLoadingAmenities(true)
    setIsLoadingMarketInsights(true)
    setError(null)
    setCurrentSuburb(suburb.trim())
    
    try {
      // Fetch properties, amenities, and market insights in parallel
      const [propertiesData, amenitiesData, marketInsightsData] = await Promise.all([
        fetchProperties(suburb.trim()),
        fetchAmenities(suburb.trim()).catch((err) => {
          console.warn('Failed to load amenities:', err)
          return [] // Don't fail if amenities fail
        }),
        fetchMarketInsights(suburb.trim()).catch((err) => {
          console.warn('Failed to load market insights:', err)
          return [] // Don't fail if market insights fail
        }),
      ])
      
      console.log('Loaded properties:', propertiesData)
      console.log('Loaded amenities:', amenitiesData)
      console.log('Loaded market insights:', marketInsightsData)
      
      setProperties(propertiesData)
      setFilteredProperties(propertiesData)
      setAmenities(amenitiesData)
      setMarketInsights(marketInsightsData)
    } catch (err) {
      console.error('Error loading properties:', err)
      setError(err instanceof Error ? err.message : 'Failed to load properties')
      setProperties([])
      setFilteredProperties([])
      setAmenities([])
      setMarketInsights([])
    } finally {
      setIsLoading(false)
      setIsLoadingAmenities(false)
      setIsLoadingMarketInsights(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      loadProperties(searchQuery.trim())
    } else {
      setError('Please enter a suburb name')
    }
  }

  // Filter properties by price range
  useEffect(() => {
    if (priceFilter === 'all') {
      setFilteredProperties(properties)
      return
    }

    const filtered = properties.filter((property) => {
      if (!property.price) return false

      switch (priceFilter) {
        case 'under-500k':
          return property.price < 500000
        case '500k-1m':
          return property.price >= 500000 && property.price < 1000000
        case '1m-2m':
          return property.price >= 1000000 && property.price < 2000000
        case 'over-2m':
          return property.price >= 2000000
        default:
          return true
      }
    })

    setFilteredProperties(filtered)
  }, [priceFilter, properties])

  // Calculate statistics
  const stats = {
    total: filteredProperties.length,
    averagePrice:
      filteredProperties.length > 0
        ? filteredProperties
            .filter((p) => p.price)
            .reduce((sum, p) => sum + (p.price || 0), 0) /
          filteredProperties.filter((p) => p.price).length
        : undefined,
    totalValue: filteredProperties
      .filter((p) => p.price)
      .reduce((sum, p) => sum + (p.price || 0), 0) || undefined,
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
        <div className="absolute bottom-16 left-0 h-60 w-60 rounded-full bg-brand-dark/40 blur-3xl" />
      </div>

      {/* Header */}
      <header className="mb-12 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-brand">
          Microburbs Property Dashboard
        </p>
        <h1 className="mb-4 text-4xl font-semibold text-slate-50 md:text-5xl">
          Australian Property Listings
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-200 md:text-lg">
          Explore properties for sale and nearby amenities across Australia with real-time data
        </p>
      </header>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
      </div>

      {/* Price Filter */}
      {properties.length > 0 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setPriceFilter('all')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              priceFilter === 'all'
                ? 'bg-brand text-slate-900'
                : 'border border-white/20 bg-white/5 text-slate-200 hover:bg-white/10'
            }`}
          >
            All Properties
          </button>
          <button
            onClick={() => setPriceFilter('under-500k')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              priceFilter === 'under-500k'
                ? 'bg-brand text-slate-900'
                : 'border border-white/20 bg-white/5 text-slate-200 hover:bg-white/10'
            }`}
          >
            Under $500K
          </button>
          <button
            onClick={() => setPriceFilter('500k-1m')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              priceFilter === '500k-1m'
                ? 'bg-brand text-slate-900'
                : 'border border-white/20 bg-white/5 text-slate-200 hover:bg-white/10'
            }`}
          >
            $500K - $1M
          </button>
          <button
            onClick={() => setPriceFilter('1m-2m')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              priceFilter === '1m-2m'
                ? 'bg-brand text-slate-900'
                : 'border border-white/20 bg-white/5 text-slate-200 hover:bg-white/10'
            }`}
          >
            $1M - $2M
          </button>
          <button
            onClick={() => setPriceFilter('over-2m')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              priceFilter === 'over-2m'
                ? 'bg-brand text-slate-900'
                : 'border border-white/20 bg-white/5 text-slate-200 hover:bg-white/10'
            }`}
          >
            Over $2M
          </button>
        </div>
      )}

      {/* Statistics Bar */}
      {!isLoading && !error && filteredProperties.length > 0 && (
        <div className="mb-8">
          <StatsBar
            totalProperties={stats.total}
            averagePrice={stats.averagePrice}
            totalValue={stats.totalValue}
          />
        </div>
      )}

      {/* Content Grid */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage 
          message={error} 
          onRetry={() => currentSuburb ? loadProperties(currentSuburb) : undefined} 
        />
      ) : filteredProperties.length === 0 && currentSuburb ? (
        <div className="py-20 text-center">
          <p className="text-xl text-slate-300">No properties found for {currentSuburb}</p>
          <p className="mt-2 text-slate-400">
            Try adjusting your search or filters
          </p>
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Properties Grid */}
          <section className="lg:col-span-3 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProperties.map((property, index) => (
              <PropertyCard 
                key={property.gnaf_pid || property.area_name || index} 
                property={property} 
              />
            ))}
          </section>
          
          {/* Amenities Sidebar */}
          <aside className="lg:col-span-1">
            <AmenitiesPanel 
              amenities={amenities} 
              isLoading={isLoadingAmenities}
            />
          </aside>
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-xl text-slate-300">Search for a suburb to get started</p>
          <p className="mt-2 text-slate-400">
            Enter a suburb name above (e.g., "Belmont North") to view properties for sale
          </p>
        </div>
      )}

      {/* Market Insights Section */}
      {!isLoading && !error && marketInsights.length > 0 && (
        <section className="mt-12">
          <MarketInsightsPanel 
            insights={marketInsights} 
            isLoading={isLoadingMarketInsights}
          />
        </section>
      )}

      {/* Footer */}
      {!isLoading && !error && filteredProperties.length > 0 && (
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>
            Showing {filteredProperties.length} of {properties.length} properties
            {currentSuburb && ` in ${currentSuburb}`}
          </p>
          {amenities.length > 0 && (
            <p className="mt-1">
              {amenities.length} amenities found nearby
            </p>
          )}
          {marketInsights.length > 0 && (
            <p className="mt-1">
              Market insights available for {marketInsights.length} locations
            </p>
          )}
          <p className="mt-2">
            Data provided by{' '}
            <a
              href="https://www.microburbs.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:text-brand-dark"
            >
              Microburbs API
            </a>
          </p>
        </footer>
      )}
    </main>
  )
}

export default App

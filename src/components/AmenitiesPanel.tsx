import type { Amenity } from '../types/amenity'

interface AmenitiesPanelProps {
  amenities: Amenity[]
  isLoading?: boolean
}

export default function AmenitiesPanel({ amenities, isLoading }: AmenitiesPanelProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h3 className="mb-4 text-xl font-semibold text-white">Nearby Amenities</h3>
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand/20 border-t-brand"></div>
        </div>
      </div>
    )
  }

  // Group amenities by category
  const groupedAmenities = amenities.reduce((acc, amenity) => {
    const category = amenity.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(amenity)
    return acc
  }, {} as Record<string, Amenity[]>)

  const categoryIcons: Record<string, string> = {
    'School': '🏫',
    'Restaurant': '🍽️',
    'Green Spaces': '🌳',
    'Bus Stop': '🚌',
    'Supermarket': '🛒',
  }

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || '📍'
  }

  if (amenities.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h3 className="mb-4 text-xl font-semibold text-white">Nearby Amenities</h3>
        <p className="text-slate-400">No amenities data available</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <h3 className="mb-4 text-xl font-semibold text-white">
        Nearby Amenities ({amenities.length})
      </h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {Object.entries(groupedAmenities).map(([category, items]) => (
          <div key={category} className="border-b border-white/10 pb-4 last:border-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xl">{getCategoryIcon(category)}</span>
              <h4 className="font-semibold text-brand">{category}</h4>
              <span className="text-xs text-slate-400">({items.length})</span>
            </div>
            <div className="ml-7 space-y-1">
              {items.slice(0, 5).map((amenity, index) => (
                <div key={index} className="text-sm text-slate-300">
                  {amenity.name && amenity.name.trim() !== '' 
                    ? amenity.name 
                    : `${category} location`}
                </div>
              ))}
              {items.length > 5 && (
                <div className="text-xs text-slate-400">
                  +{items.length - 5} more {category.toLowerCase()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



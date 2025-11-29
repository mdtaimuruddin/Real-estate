import type { Property } from '../types/property'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price?: number) => {
    if (!price) return 'Price on request'
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Extract data from nested structure
  const address = property.address
  const attributes = property.attributes
  const street = address?.street || ''
  const suburb = address?.sal || ''
  const state = address?.state || ''
  const propertyType = property.property_type || ''
  const price = property.price
  const bedrooms = attributes?.bedrooms
  const bathrooms = attributes?.bathrooms
  const parking = attributes?.garage_spaces
  const landSize = attributes?.land_size
  const buildingSize = attributes?.building_size
  const description = attributes?.description
  const listingDate = property.listing_date

  return (
    <article className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-xl shadow-black/20 backdrop-blur transition-all duration-300 hover:translate-y-[-4px] hover:border-brand/40 hover:bg-white/10">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          {propertyType && (
            <span className="inline-block rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
              {propertyType}
            </span>
          )}
        </div>
        {listingDate && (
          <div className="text-right">
            <div className="text-xs text-slate-400">Listed</div>
            <div className="text-xs text-slate-300">
              {new Date(listingDate).toLocaleDateString('en-AU', { 
                day: 'numeric', 
                month: 'short' 
              })}
            </div>
          </div>
        )}
      </div>

      {/* Address */}
      <h2 className="mb-2 text-xl font-semibold text-white line-clamp-2">
        {street || property.area_name || 'Address not available'}
      </h2>
      
      {/* Location */}
      {(suburb || state) && (
        <p className="mb-4 text-sm text-slate-300">
          {[suburb, state].filter(Boolean).join(', ')}
        </p>
      )}

      {/* Price */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-brand">
          {formatPrice(price)}
        </p>
      </div>

      {/* Property Details */}
      <div className="mb-4 grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
        {bedrooms !== undefined && (
          <div>
            <div className="text-xs text-slate-400">Bedrooms</div>
            <div className="text-lg font-semibold text-white">
              {bedrooms}
            </div>
          </div>
        )}
        {bathrooms !== undefined && (
          <div>
            <div className="text-xs text-slate-400">Bathrooms</div>
            <div className="text-lg font-semibold text-white">
              {bathrooms}
            </div>
          </div>
        )}
        {parking !== undefined && (
          <div>
            <div className="text-xs text-slate-400">Parking</div>
            <div className="text-lg font-semibold text-white">
              {parking}
            </div>
          </div>
        )}
      </div>

      {/* Size Information */}
      {(landSize || buildingSize) && (
        <div className="mb-4 flex gap-4 text-sm text-slate-300">
          {landSize && (
            <span>Land: {landSize}</span>
          )}
          {buildingSize && buildingSize !== 'None' && (
            <span>Building: {buildingSize}</span>
          )}
        </div>
      )}

      {/* Description Preview */}
      {description && (
        <p className="mb-4 line-clamp-2 text-xs text-slate-400">
          {description}
        </p>
      )}

      {/* View Details Link */}
      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-sm font-semibold text-brand transition-colors group-hover:text-brand-dark">
          View details
        </span>
        <span aria-hidden="true" className="text-brand transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </article>
  )
}



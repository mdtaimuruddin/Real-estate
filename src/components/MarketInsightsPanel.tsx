import { useState, useMemo } from 'react'
import type { StreetMarketInsight } from '../types/marketInsights'

interface MarketInsightsPanelProps {
  insights: StreetMarketInsight[]
  isLoading?: boolean
}

export default function MarketInsightsPanel({ insights, isLoading }: MarketInsightsPanelProps) {
  const [streetQuery, setStreetQuery] = useState('')

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatRent = (rent?: number) => {
    if (!rent) return 'N/A'
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0,
    }).format(rent)
  }

  const formatPercentage = (value?: number) => {
    if (value === undefined || value === null) return 'N/A'
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const getGrowthColor = (growth?: number) => {
    if (!growth) return 'text-slate-400'
    if (growth > 0) return 'text-green-400'
    if (growth < 0) return 'text-red-400'
    return 'text-slate-400'
  }

  const getTurnoverCommentColor = (comment?: string) => {
    if (!comment) return 'text-slate-400'
    const lower = comment.toLowerCase()
    if (lower.includes('tightly') || lower.includes('very')) return 'text-green-400'
    if (lower.includes('average')) return 'text-yellow-400'
    if (lower.includes('high') || lower.includes('frequent')) return 'text-orange-400'
    return 'text-slate-400'
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h3 className="mb-4 text-xl font-semibold text-white">Market Insights by Street</h3>
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand/20 border-t-brand"></div>
        </div>
      </div>
    )
  }

  if (insights.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h3 className="mb-4 text-xl font-semibold text-white">Market Insights by Street</h3>
        <p className="text-slate-400">No market insights data available</p>
      </div>
    )
  }

  // Separate suburb-level and street-level insights
  const suburbInsight = insights.find((i) => i.street_type === 'Suburb')
  const streetInsights = useMemo(
    () => insights.filter((i) => i.street_type !== 'Suburb'),
    [insights],
  )

  const filteredStreetInsights = useMemo(() => {
    if (!streetQuery.trim()) return streetInsights
    const query = streetQuery.trim().toLowerCase()
    return streetInsights.filter((insight) =>
      insight.area_name?.toLowerCase().includes(query),
    )
  }, [streetInsights, streetQuery])

  return (
    <div className="space-y-6">
      {/* Suburb Overview Card */}
      {suburbInsight && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Suburb Overview</h3>
            <span className="rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold text-brand">
              {suburbInsight.area_name}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Property Value */}
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="mb-1 text-xs text-slate-400">Median Property Value</div>
              <div className="text-2xl font-bold text-white">
                {formatPrice(suburbInsight.value)}
              </div>
              {suburbInsight.growth !== undefined && (
                <div className={`mt-1 text-sm font-semibold ${getGrowthColor(suburbInsight.growth)}`}>
                  {formatPercentage(suburbInsight.growth)} growth
                </div>
              )}
            </div>

            {/* Rental Value */}
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="mb-1 text-xs text-slate-400">Median Weekly Rent</div>
              <div className="text-2xl font-bold text-white">
                {formatRent(suburbInsight.value_rent)}/week
              </div>
            </div>

            {/* Properties Count */}
            {suburbInsight.properties !== undefined && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-1 text-xs text-slate-400">Total Properties</div>
                <div className="text-2xl font-bold text-white">
                  {suburbInsight.properties.toLocaleString('en-AU')}
                </div>
                {suburbInsight.property_type && (
                  <div className="mt-1 text-xs text-slate-400 capitalize">
                    {suburbInsight.property_type}
                  </div>
                )}
              </div>
            )}

            {/* Renters Percentage */}
            {suburbInsight.renters_percentage !== undefined && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-1 text-xs text-slate-400">Renters</div>
                <div className="text-2xl font-bold text-white">
                  {(suburbInsight.renters_percentage * 100).toFixed(1)}%
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {((1 - suburbInsight.renters_percentage) * 100).toFixed(1)}% owner-occupied
                </div>
              </div>
            )}
          </div>

          {/* Turnover Rates */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {suburbInsight.turnover_rate && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-1 text-xs text-slate-400">Sales Turnover Rate</div>
                <div className="text-xl font-bold text-white">
                  {suburbInsight.turnover_rate.value}%
                </div>
                <div className={`mt-1 text-xs font-medium ${getTurnoverCommentColor(suburbInsight.turnover_rate.comment)}`}>
                  {suburbInsight.turnover_rate.comment}
                </div>
              </div>
            )}

            {suburbInsight.turnover_rate_rent && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-1 text-xs text-slate-400">Rental Turnover Rate</div>
                <div className="text-xl font-bold text-white">
                  {suburbInsight.turnover_rate_rent.value}%
                </div>
                <div className={`mt-1 text-xs font-medium ${getTurnoverCommentColor(suburbInsight.turnover_rate_rent.comment)}`}>
                  {suburbInsight.turnover_rate_rent.comment}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Street-Level Insights */}
      {streetInsights.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="text-xl font-semibold text-white">
              Street-Level Insights ({filteredStreetInsights.length}
              {streetInsights.length !== filteredStreetInsights.length &&
                ` of ${streetInsights.length}`})
            </h3>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={streetQuery}
                onChange={(e) => setStreetQuery(e.target.value)}
                placeholder="Filter by street (area_name)..."
                className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>
            </div>
          </div>

          {filteredStreetInsights.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-400">
              No streets match “{streetQuery}”. Try adjusting the filter.
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredStreetInsights.map((insight, index) => (
                <div
                  key={`${insight.area_name}-${index}`}
                  className="rounded-lg border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {insight.street_type}
                      </p>
                      <h4 className="font-semibold text-white">{insight.area_name}</h4>
                    </div>
                    {insight.growth !== undefined && (
                      <span className={`text-sm font-bold ${getGrowthColor(insight.growth)}`}>
                        {formatPercentage(insight.growth)}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {insight.value !== undefined && (
                      <div>
                        <div className="text-xs text-slate-400">Value</div>
                        <div className="font-semibold text-white">{formatPrice(insight.value)}</div>
                      </div>
                    )}
                    {insight.value_rent !== undefined && (
                      <div>
                        <div className="text-xs text-slate-400">Rent/week</div>
                        <div className="font-semibold text-white">
                          {formatRent(insight.value_rent)}
                        </div>
                      </div>
                    )}
                    {insight.properties !== undefined && (
                      <div>
                        <div className="text-xs text-slate-400">Properties</div>
                        <div className="font-semibold text-white">
                          {insight.properties.toLocaleString('en-AU')}
                        </div>
                      </div>
                    )}
                    {insight.renters_percentage !== undefined && (
                      <div>
                        <div className="text-xs text-slate-400">Renters</div>
                        <div className="font-semibold text-white">
                          {(insight.renters_percentage * 100).toFixed(1)}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}


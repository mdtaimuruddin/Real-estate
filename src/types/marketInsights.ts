export interface TurnoverRate {
  comment: string
  value: number
}

export interface StreetMarketInsight {
  area_level: string
  area_name: string
  growth?: number
  properties?: number
  property_type?: string
  renters_percentage?: number
  street_type: string
  turnover_rate?: TurnoverRate
  turnover_rate_rent?: TurnoverRate
  value?: number
  value_rent?: number
}

export interface MarketInsightsResponse {
  results?: StreetMarketInsight[][]
  [key: string]: unknown
}


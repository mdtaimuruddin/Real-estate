interface StatsBarProps {
  totalProperties: number
  averagePrice?: number
  totalValue?: number
}

export default function StatsBar({ totalProperties, averagePrice, totalValue }: StatsBarProps) {
  const formatPrice = (price?: number) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="text-sm text-slate-400">Total Properties</div>
        <div className="mt-1 text-2xl font-bold text-white">{totalProperties}</div>
      </div>
      {averagePrice && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="text-sm text-slate-400">Average Price</div>
          <div className="mt-1 text-2xl font-bold text-brand">{formatPrice(averagePrice)}</div>
        </div>
      )}
      {totalValue && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="text-sm text-slate-400">Total Value</div>
          <div className="mt-1 text-2xl font-bold text-white">{formatPrice(totalValue)}</div>
        </div>
      )}
    </div>
  )
}



interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  isLoading?: boolean
}

export default function SearchBar({ value, onChange, onSearch, isLoading }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search by suburb (e.g., Belmont North, Sydney, Melbourne)..."
            className="w-full rounded-full border border-white/20 bg-white/10 px-6 py-4 text-white placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20"
            disabled={isLoading}
          />
          <svg
            className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-full bg-brand px-8 py-4 text-sm font-semibold text-slate-900 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/50 hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </div>
    </form>
  )
}


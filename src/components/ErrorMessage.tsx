interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const isUnauthorized = message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('sandbox')
  
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-full bg-red-500/20 p-4">
        <svg
          className="h-8 w-8 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">Error loading properties</h3>
      <p className="mb-4 max-w-md text-slate-300">{message}</p>
      
      {isUnauthorized && (
        <div className="mb-6 max-w-md rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-left">
          <p className="mb-2 text-sm font-semibold text-yellow-400">Note about Sandbox API:</p>
          <p className="text-xs text-slate-300">
            The sandbox token only works with specific demo suburbs. Try searching for suburbs like:
          </p>
          <ul className="mt-2 list-disc list-inside text-xs text-slate-300 space-y-1">
            <li>Belmont North</li>
            <li>Other demo suburbs (check Microburbs documentation)</li>
          </ul>
        </div>
      )}
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-slate-900 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/50 hover:bg-brand-dark"
        >
          Try Again
        </button>
      )}
    </div>
  )
}


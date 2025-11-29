export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand/20 border-t-brand"></div>
      <p className="mt-4 text-slate-300">Loading properties...</p>
    </div>
  )
}



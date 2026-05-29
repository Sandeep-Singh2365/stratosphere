export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-700 rounded-lg" />
        ))}
      </div>
      <div className="h-96 bg-slate-800 rounded-xl" />
    </div>
  )
}

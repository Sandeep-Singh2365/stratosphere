export default function InstituteLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-48 bg-institute-border rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-institute-border rounded-lg" />
        ))}
      </div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-institute-border rounded-lg" />
        ))}
      </div>
    </div>
  )
}

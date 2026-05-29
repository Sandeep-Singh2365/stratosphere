export default function WireLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 bg-wire-border rounded mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
        <div className="lg:col-span-2 h-96 bg-wire-card rounded-xl" />
        <div className="flex flex-col gap-4">
          <div className="h-44 bg-wire-card rounded-lg" />
          <div className="h-44 bg-wire-card rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-wire-card rounded-lg" />
        ))}
      </div>
    </div>
  )
}

import Link from 'next/link'

interface ResearchAreaCardProps {
  name: string
  slug: string
  color: string
  count: number
  type: 'region' | 'topic'
}

export default function ResearchAreaCard({ 
  name, slug, color, count, type 
}: ResearchAreaCardProps) {
  const href = type === 'topic' 
    ? `/institute/topic/${slug}` 
    : `/institute/region/${slug}`

  return (
    <Link href={href}>
      <div className="bg-institute-card rounded-xl border border-institute-border 
        hover:border-institute-accent hover:shadow-sm transition-all p-5">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <h3 className="text-sm font-semibold text-institute-text">
            {name}
          </h3>
        </div>
        <p className="text-institute-muted text-xs">
          {count} publication{count !== 1 ? 's' : ''}
        </p>
      </div>
    </Link>
  )
}

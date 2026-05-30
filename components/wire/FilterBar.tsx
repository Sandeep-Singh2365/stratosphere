'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Region, Topic } from '@/types'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  regions: Region[]
  topics: Topic[]
  basePath: string
}

export default function FilterBar({ regions, topics, basePath }: FilterBarProps) {
  const searchParams = useSearchParams()
  const activeRegion = searchParams.get('region')
  const activeTopic = searchParams.get('topic')

  const buildUrl = (region?: string | null, topic?: string | null) => {
    const params = new URLSearchParams()
    if (region) params.set('region', region)
    if (topic) params.set('topic', topic)
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  const pillBase = "px-3 py-1 rounded-full text-xs font-medium transition-colors border"
  const active = "bg-wire-accent text-white border-wire-accent"
  const inactive = "bg-wire-card text-wire-muted border-wire-border hover:border-wire-accent hover:text-white"

  return (
    <div className="flex flex-wrap gap-2 py-4">
      <Link
        href={basePath}
        className={cn(pillBase, !activeRegion && !activeTopic ? active : inactive)}
      >
        All
      </Link>
      {regions.map(r => (
        <Link
          key={r.id}
          href={buildUrl(r.slug, activeTopic)}
          className={cn(pillBase, activeRegion === r.slug ? active : inactive)}
        >
          {r.name}
        </Link>
      ))}
      {topics.map(t => (
        <Link
          key={t.id}
          href={buildUrl(activeRegion, t.slug)}
          className={cn(pillBase, activeTopic === t.slug ? active : inactive)}
        >
          {t.name}
        </Link>
      ))}
    </div>
  )
}

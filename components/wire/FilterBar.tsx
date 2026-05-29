'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Region, Topic } from '@/types'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  regions: Region[]
  topics: Topic[]
  basePath: string
}

export default function FilterBar({ regions, topics, basePath }: FilterBarProps) {
  const router = useRouter()
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

  const pillBase = "px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors border"
  const active = "bg-wire-accent text-white border-wire-accent"
  const inactive = "bg-wire-card text-wire-muted border-wire-border hover:border-wire-accent hover:text-white"

  return (
    <div className="flex flex-wrap gap-2 py-4">
      <button
        onClick={() => router.push(basePath)}
        className={cn(pillBase, !activeRegion && !activeTopic ? active : inactive)}
      >
        All
      </button>
      {regions.map(r => (
        <button
          key={r.id}
          onClick={() => router.push(buildUrl(r.slug, activeTopic))}
          className={cn(pillBase, activeRegion === r.slug ? active : inactive)}
        >
          {r.name}
        </button>
      ))}
      {topics.map(t => (
        <button
          key={t.id}
          onClick={() => router.push(buildUrl(activeRegion, t.slug))}
          className={cn(pillBase, activeTopic === t.slug ? active : inactive)}
        >
          {t.name}
        </button>
      ))}
    </div>
  )
}

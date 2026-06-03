'use client'
import { useMemo, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Region, Topic } from '@/types'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  regions: Region[]
  topics: Topic[]
  /**
   * Base path for filters, e.g. "/wire".
   * If omitted, we fall back to the current pathname.
   */
  basePath?: string
}

/**
 * Smooth, non-glitchy filter bar:
 * - Uses router.replace() inside startTransition() to avoid UI jank.
 * - Uses <select> controls on mobile to prevent massive wrapping/relayout.
 * - Uses pill buttons on desktop for fast scanning.
 */
export default function FilterBar({ regions, topics, basePath }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const activeRegion = searchParams.get('region')
  const activeTopic = searchParams.get('topic')

  const targetBase = basePath ?? pathname

  const navigate = (next: { region?: string | null; topic?: string | null }) => {
    const params = new URLSearchParams(searchParams.toString())

    if (next.region === null) params.delete('region')
    else if (typeof next.region === 'string' && next.region.length > 0) params.set('region', next.region)

    if (next.topic === null) params.delete('topic')
    else if (typeof next.topic === 'string' && next.topic.length > 0) params.set('topic', next.topic)

    const qs = params.toString()
    const href = qs ? `${targetBase}?${qs}` : targetBase

    startTransition(() => {
      router.replace(href, { scroll: false })
    })
  }

  const regionOptions = useMemo(
    () => [{ slug: '', name: 'All regions' }, ...regions.map(r => ({ slug: r.slug, name: r.name }))],
    [regions]
  )

  const topicOptions = useMemo(
    () => [{ slug: '', name: 'All topics' }, ...topics.map(t => ({ slug: t.slug, name: t.name }))],
    [topics]
  )

  const pillBase =
    'px-3 py-1 rounded-full text-xs font-medium transition-colors border whitespace-nowrap'
  const active =
    'bg-wire-accent text-white border-wire-accent'
  const inactive =
    'bg-wire-card text-wire-muted border-wire-border hover:border-wire-accent hover:text-white'

  return (
    <div className="py-4 space-y-3">
      {/* Mobile: compact selects to avoid layout thrash */}
      <div className="flex flex-col sm:hidden gap-2">
        <label className="text-xs text-wire-muted">
          Region
          <select
            value={activeRegion ?? ''}
            disabled={isPending}
            onChange={(e) => navigate({ region: e.target.value || null })}
            className={cn(
              'mt-1 w-full rounded-lg border px-3 py-2 text-sm',
              'bg-wire-card border-wire-border text-white',
              'focus:outline-none focus:ring-2 focus:ring-wire-accent/40'
            )}
          >
            {regionOptions.map(opt => (
              <option key={opt.slug} value={opt.slug} className="bg-wire-bg">
                {opt.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs text-wire-muted">
          Topic
          <select
            value={activeTopic ?? ''}
            disabled={isPending}
            onChange={(e) => navigate({ topic: e.target.value || null })}
            className={cn(
              'mt-1 w-full rounded-lg border px-3 py-2 text-sm',
              'bg-wire-card border-wire-border text-white',
              'focus:outline-none focus:ring-2 focus:ring-wire-accent/40'
            )}
          >
            {topicOptions.map(opt => (
              <option key={opt.slug} value={opt.slug} className="bg-wire-bg">
                {opt.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          disabled={isPending}
          onClick={() => navigate({ region: null, topic: null })}
          className={cn(
            'rounded-lg border px-3 py-2 text-sm',
            'bg-wire-bg border-wire-border text-wire-muted hover:text-white hover:border-wire-accent transition-colors'
          )}
        >
          Clear filters
        </button>
      </div>

      {/* Desktop: pills (horizontal scroll if needed, no wrapping glitches) */}
      <div className="hidden sm:flex flex-col gap-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => navigate({ region: null, topic: null })}
            className={cn(pillBase, !activeRegion && !activeTopic ? active : inactive)}
          >
            All
          </button>
          {regions.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => navigate({ region: activeRegion === r.slug ? null : r.slug })}
              className={cn(pillBase, activeRegion === r.slug ? active : inactive)}
            >
              {r.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {topics.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate({ topic: activeTopic === t.slug ? null : t.slug })}
              className={cn(pillBase, activeTopic === t.slug ? active : inactive)}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

import { getArticlesBySection, getArticlesByTopic, 
  getArticlesByRegion } from '@/lib/queries'
import { getAllTopics, getAllRegions } from '@/lib/queries'
import PaperCard from '@/components/institute/PaperCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BriefsPage({ 
  searchParams 
}: { 
  searchParams: { topic?: string; region?: string; q?: string }
}) {
  const [allPapers, topics, regions] = await Promise.all([
    getArticlesBySection('institute', 100),
    getAllTopics(),
    getAllRegions(),
  ])

  const activeTopic = searchParams.topic
  const activeRegion = searchParams.region
  const searchQuery = searchParams.q?.toLowerCase().trim()

  let papers = allPapers

  if (activeTopic) {
    papers = papers.filter(p => p.topics.some(t => t.slug === activeTopic))
  }
  if (activeRegion) {
    papers = papers.filter(p => p.regions.some(r => r.slug === activeRegion))
  }
  if (searchQuery) {
    papers = papers.filter(p =>
      p.title.toLowerCase().includes(searchQuery) ||
      (p.abstract?.toLowerCase().includes(searchQuery))
    )
  }

  const activeTopicName = topics.find(t => t.slug === activeTopic)?.name
  const activeRegionName = regions.find(r => r.slug === activeRegion)?.name
  const isFiltered = !!(activeTopic || activeRegion || searchQuery)

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-institute-text mb-2">
        Publications
      </h1>
      <p className="text-institute-muted text-sm mb-6">
        Policy papers, research reports, and strategic briefs from 
        Stratosphere Institute fellows.
      </p>

      {/* Search bar */}
      <form method="GET" action="/institute/briefs" 
        className="mb-6">
        <div className="flex gap-3 max-w-xl">
          <input
            name="q"
            defaultValue={searchQuery}
            placeholder="Search publications..."
            className="flex-1 bg-white border border-institute-border 
              rounded-lg px-4 py-2 text-institute-text text-sm 
              focus:outline-none focus:border-institute-accent"
          />
          {activeTopic && (
            <input type="hidden" name="topic" value={activeTopic} />
          )}
          {activeRegion && (
            <input type="hidden" name="region" value={activeRegion} />
          )}
          <button type="submit"
            className="bg-institute-accent text-white px-5 py-2 
              rounded-lg text-sm font-medium hover:bg-amber-900 
              transition-colors">
            Search
          </button>
        </div>
      </form>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link href="/institute/briefs"
          className={`px-3 py-1 rounded-full text-xs font-medium 
            border transition-colors ${!isFiltered
              ? 'bg-institute-accent text-white border-institute-accent'
              : 'bg-white text-institute-muted border-institute-border hover:border-institute-accent'
            }`}>
          All
        </Link>
        {topics.map(t => (
          <Link key={t.id}
            href={`/institute/briefs?topic=${t.slug}${activeRegion ? '&region=' + activeRegion : ''}${searchQuery ? '&q=' + searchQuery : ''}`}
            className={`px-3 py-1 rounded-full text-xs font-medium 
              border transition-colors ${activeTopic === t.slug
                ? 'bg-institute-accent text-white border-institute-accent'
                : 'bg-white text-institute-muted border-institute-border hover:border-institute-accent'
              }`}>
            {t.name}
          </Link>
        ))}
        {regions.map(r => (
          <Link key={r.id}
            href={`/institute/briefs?region=${r.slug}${activeTopic ? '&topic=' + activeTopic : ''}${searchQuery ? '&q=' + searchQuery : ''}`}
            className={`px-3 py-1 rounded-full text-xs font-medium 
              border transition-colors ${activeRegion === r.slug
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-white text-institute-muted border-institute-border hover:border-institute-accent'
              }`}>
            {r.name}
          </Link>
        ))}
      </div>

      {/* Results count */}
      {isFiltered && (
        <div className="flex items-center gap-3 mb-4">
          <p className="text-institute-muted text-sm">
            {papers.length} result{papers.length !== 1 ? 's' : ''}
            {activeTopicName ? ` in ${activeTopicName}` : ''}
            {activeRegionName ? ` · ${activeRegionName}` : ''}
            {searchQuery ? ` for "${searchQuery}"` : ''}
          </p>
          <Link href="/institute/briefs"
            className="text-institute-accent text-xs hover:underline">
            Clear filters ×
          </Link>
        </div>
      )}

      {/* Results */}
      {papers.length === 0 ? (
        <p className="text-institute-muted py-8 text-center">
          No publications match your search.
        </p>
      ) : (
        <div className="space-y-4">
          {papers.map(paper => (
            <PaperCard key={paper.id} article={paper} variant="list" />
          ))}
        </div>
      )}
    </div>
  )
}

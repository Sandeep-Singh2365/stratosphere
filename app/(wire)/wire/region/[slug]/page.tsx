import { getArticlesByRegion, getAllRegions, getAllTopics } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ArticleCard from '@/components/wire/ArticleCard'
import FilterBar from '@/components/wire/FilterBar'

export const dynamic = 'force-dynamic'

export default async function RegionPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const [articles, regions, topics] = await Promise.all([
    getArticlesByRegion(params.slug, 'wire'),
    getAllRegions(),
    getAllTopics(),
  ])

  const currentRegion = regions.find(r => r.slug === params.slug)
  if (!currentRegion && articles.length === 0) notFound()

  return (
    <div>
      <Link href="/wire/regions"
        className="text-wire-muted hover:text-white text-sm mb-6 
          inline-block transition-colors">
        ← All Regions
      </Link>
      <div className="flex items-center gap-3 mb-2">
        {currentRegion?.color && (
          <span className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: currentRegion.color }} />
        )}
        <h1 className="text-3xl font-serif font-bold text-white">
          {currentRegion?.name ?? params.slug}
        </h1>
      </div>
      <p className="text-wire-muted text-sm mb-6">
        {articles.length} articles
      </p>
      <FilterBar
        regions={regions}
        topics={topics}
        basePath={`/wire/region/${params.slug}`}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
        gap-6 mt-6">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} variant="grid" />
        ))}
      </div>
    </div>
  )
}

import { getArticlesByRegion, getArticlesByTopic,
  getAllRegions, getAllTopics } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ArticleCard from '@/components/wire/ArticleCard'
import FilterBar from '@/components/wire/FilterBar'

export const dynamic = 'force-dynamic'

export default async function RegionPage({ 
  params,
  searchParams,
}: { 
  params: { slug: string }
  searchParams: { topic?: string }
}) {
  const activeTopic = searchParams.topic
  const [allRegions, topics] = await Promise.all([
    getAllRegions(),
    getAllTopics(),
  ])
  const currentRegion = allRegions.find(r => r.slug === params.slug)
  if (!currentRegion) notFound()

  let articles
  if (activeTopic) {
    const regionArticles = await getArticlesByRegion(params.slug, 'wire')
    const topicArticles = await getArticlesByTopic(activeTopic, 'wire')
    const topicIds = new Set(topicArticles.map(a => a.id))
    articles = regionArticles.filter(a => topicIds.has(a.id))
  } else {
    articles = await getArticlesByRegion(params.slug, 'wire')
  }

  return (
    <div>
      <Link href="/wire/regions"
        className="text-wire-muted hover:text-white text-sm mb-6 
          inline-block transition-colors">
        ← All Regions
      </Link>
      <div className="flex items-center gap-3 mb-2">
        {currentRegion.color && (
          <span className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: currentRegion.color }} />
        )}
        <h1 className="text-3xl font-serif font-bold text-white">
          {currentRegion.name}
        </h1>
      </div>
      <p className="text-wire-muted text-sm mb-2">
        {articles.length} articles
      </p>
      {activeTopic && (
        <Link href={`/wire/region/${params.slug}`}
          className="text-wire-muted hover:text-white text-xs mb-4 
            inline-block">
          Clear topic filter ×
        </Link>
      )}
      <FilterBar
        regions={[]}
        topics={topics}
        basePath={`/wire/region/${params.slug}`}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
        gap-6 mt-6">
        {articles.length === 0 ? (
          <p className="text-wire-muted col-span-3">
            No articles match this filter.
          </p>
        ) : (
          articles.map(article => (
            <ArticleCard key={article.id} article={article} variant="grid" />
          ))
        )}
      </div>
    </div>
  )
}

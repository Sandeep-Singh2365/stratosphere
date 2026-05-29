import { getArticlesByTopic, getArticlesByRegion,
  getAllRegions, getAllTopics } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ArticleCard from '@/components/wire/ArticleCard'
import FilterBar from '@/components/wire/FilterBar'

export const dynamic = 'force-dynamic'

export default async function TopicPage({ 
  params,
  searchParams,
}: { 
  params: { slug: string }
  searchParams: { region?: string }
}) {
  const activeRegion = searchParams.region
  const [regions, allTopics] = await Promise.all([
    getAllRegions(),
    getAllTopics(),
  ])
  const currentTopic = allTopics.find(t => t.slug === params.slug)
  if (!currentTopic) notFound()

  let articles
  if (activeRegion) {
    const topicArticles = await getArticlesByTopic(params.slug, 'wire')
    const regionArticles = await getArticlesByRegion(activeRegion, 'wire')
    const regionIds = new Set(regionArticles.map(a => a.id))
    articles = topicArticles.filter(a => regionIds.has(a.id))
  } else {
    articles = await getArticlesByTopic(params.slug, 'wire')
  }

  return (
    <div>
      <Link href="/wire/topics"
        className="text-wire-muted hover:text-white text-sm mb-6 
          inline-block transition-colors">
        ← All Topics
      </Link>
      <div className="flex items-center gap-3 mb-2">
        {currentTopic.color && (
          <span className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: currentTopic.color }} />
        )}
        <h1 className="text-3xl font-serif font-bold text-white">
          {currentTopic.name}
        </h1>
      </div>
      <p className="text-wire-muted text-sm mb-2">
        {articles.length} articles
      </p>
      {activeRegion && (
        <Link href={`/wire/topic/${params.slug}`}
          className="text-wire-muted hover:text-white text-xs mb-4 
            inline-block">
          Clear region filter ×
        </Link>
      )}
      <FilterBar
        regions={regions}
        topics={[]}
        basePath={`/wire/topic/${params.slug}`}
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

import { getArticlesBySection, getArticlesByRegion, 
  getArticlesByTopic, getFeaturedArticles } from '@/lib/queries'
import { getAllAnalysts, getAllRegions, getAllTopics } from '@/lib/queries'
import BreakingTicker from '@/components/wire/BreakingTicker'
import ArticleCard from '@/components/wire/ArticleCard'
import FilterBar from '@/components/wire/FilterBar'
import AnalystCard from '@/components/wire/AnalystCard'
import NewsletterForm from '@/components/shared/NewsletterForm'
import nextDynamic from 'next/dynamic'
import CoverageChart from '@/components/shared/CoverageChart'

const WorldMap = nextDynamic(
  () => import('@/components/shared/WorldMap'),
  { ssr: false, loading: () => (
    <div className="h-80 bg-wire-card border border-wire-border rounded-xl animate-pulse" />
  )}
)

export const dynamic = 'force-dynamic'

export default async function WireHomePage({ 
  searchParams 
}: { 
  searchParams: { region?: string; topic?: string } 
}) {
  const activeRegion = searchParams.region
  const activeTopic = searchParams.topic

  const [featured, regions, topics, analysts] = await Promise.all([
    getFeaturedArticles('wire'),
    getAllRegions(),
    getAllTopics(),
    getAllAnalysts('wire'),
  ])

  const regionChartData = regions.map(r => ({
    name: r.name.split(' ')[0], // first word for brevity
    count: r.article_count ?? 0,
    color: r.color,
  }))

  const topicChartData = topics.map(t => ({
    name: t.name.split(' ')[0],
    count: t.article_count ?? 0,
    color: t.color,
  }))

  const articleCountsByRegion = Object.fromEntries(
    regions.map(r => [r.slug, r.article_count ?? 0])
  )

  let articles
  if (activeRegion) {
    articles = await getArticlesByRegion(activeRegion, 'wire')
  } else if (activeTopic) {
    articles = await getArticlesByTopic(activeTopic, 'wire')
  } else {
    articles = await getArticlesBySection('wire', 20)
  }

  const tickerArticles = (await getArticlesBySection('wire', 5))
    .map(a => ({ title: a.title, slug: a.slug }))

  const isFiltered = !!(activeRegion || activeTopic)
  const activeRegionObj = regions.find(r => r.slug === activeRegion)
  const activeTopicObj = topics.find(t => t.slug === activeTopic)
  const filterName = activeRegionObj?.name || activeTopicObj?.name || ''

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <BreakingTicker articles={tickerArticles} />
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Hero - always visible */}
        {featured.length > 0 && (
          <section className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ArticleCard article={featured[0]} variant="featured" />
              </div>
              <div className="flex flex-col gap-4">
                {featured[1] && (
                  <ArticleCard article={featured[1]} variant="list" />
                )}
                {featured[2] && (
                  <ArticleCard article={featured[2]} variant="list" />
                )}
              </div>
            </div>
          </section>
        )}

        <hr className="border-wire-border" />

        {/* Latest Analysis */}
        <section className="py-8">
          <div className="flex flex-col mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-white">
                {isFiltered ? `Analysis: ${filterName}` : 'Latest Analysis'}
              </h2>
              {isFiltered && (
                <a href="/wire"
                  className="text-wire-accent hover:underline text-sm font-medium transition-colors">
                  Clear ×
                </a>
              )}
            </div>
            {isFiltered && (
              <p className="text-wire-muted text-sm mt-1">
                Showing {articles.length} result{articles.length !== 1 ? 's' : ''} for {filterName}
              </p>
            )}
          </div>
          <FilterBar regions={regions} topics={topics} basePath="/wire" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
            gap-6 mt-6">
            {articles.length === 0 ? (
              <p className="text-wire-muted col-span-3">
                No articles found for this filter.
              </p>
            ) : (
              (isFiltered ? articles.slice(0, 6) : articles).map(article => (
                <ArticleCard key={article.id} article={article} 
                  variant="grid" />
              ))
            )}
          </div>

          {/* Show all results link if filtered and > 6 results */}
          {isFiltered && articles.length > 6 && (
            <div className="flex justify-center mt-8">
              <a
                href={activeRegion ? `/wire/region/${activeRegion}` : `/wire/topic/${activeTopic}`}
                className="text-wire-accent hover:underline text-sm font-semibold flex items-center gap-1"
              >
                Show all {articles.length} results →
              </a>
            </div>
          )}
        </section>

        <hr className="border-wire-border" />

        {/* Contributing Experts */}
        <section className="py-8">
          <h2 className="text-xl font-serif font-bold text-white mb-6">
            Contributing Experts
          </h2>
          <div className="flex flex-wrap gap-4">
            {analysts.map(analyst => (
              <AnalystCard key={analyst.id} analyst={analyst} />
            ))}
          </div>
        </section>

        <hr className="border-wire-border" />
        
        {/* Global Coverage */}
        <section className="py-8">
          <h2 className="text-xl font-serif font-bold text-white mb-6">
            Global Coverage
          </h2>
          <WorldMap 
            theme="wire" 
            section="wire"
            articleCounts={articleCountsByRegion}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <CoverageChart 
              data={regionChartData} 
              theme="wire" 
              title="Articles by Region" 
            />
            <CoverageChart 
              data={topicChartData} 
              theme="wire" 
              title="Articles by Topic" 
            />
          </div>
        </section>

        <section className="bg-wire-card border border-wire-border 
          rounded-xl p-8 my-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            Stay Ahead of the World
          </h2>
          <p className="text-wire-muted mb-6">
            Daily geopolitical briefings delivered to your inbox.
          </p>
          <NewsletterForm theme="wire" />
        </section>
      </div>
    </div>
  )
}

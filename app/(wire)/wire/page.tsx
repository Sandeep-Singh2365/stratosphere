import { getArticlesBySection, getArticlesByRegion, 
  getArticlesByTopic, getFeaturedArticles } from '@/lib/queries'
import { getAllAnalysts, getAllRegions, getAllTopics } from '@/lib/queries'
import BreakingTicker from '@/components/wire/BreakingTicker'
import ArticleCard from '@/components/wire/ArticleCard'
import FilterBar from '@/components/wire/FilterBar'
import AnalystCard from '@/components/wire/AnalystCard'
import NewsletterForm from '@/components/shared/NewsletterForm'

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
    getAllAnalysts(),
  ])

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

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <BreakingTicker articles={tickerArticles} />
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Hero - only show when not filtered */}
        {!isFiltered && featured.length > 0 && (
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

        {!isFiltered && <hr className="border-wire-border" />}

        {/* Latest Analysis */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-serif font-bold text-white">
              {isFiltered ? 'Filtered Results' : 'Latest Analysis'}
            </h2>
            {isFiltered && (
              <a href="/wire"
                className="text-wire-muted hover:text-white text-sm 
                  transition-colors">
                Clear filters ×
              </a>
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
              articles.map(article => (
                <ArticleCard key={article.id} article={article} 
                  variant="grid" />
              ))
            )}
          </div>
        </section>

        {!isFiltered && (
          <>
            <hr className="border-wire-border" />
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
          </>
        )}
      </div>
    </div>
  )
}

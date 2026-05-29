import { getFeaturedArticles, getArticlesBySection } from '@/lib/queries'
import { getAllAnalysts } from '@/lib/queries'
import { getAllRegions, getAllTopics } from '@/lib/queries'
import BreakingTicker from '@/components/wire/BreakingTicker'
import ArticleCard from '@/components/wire/ArticleCard'
import FilterBar from '@/components/wire/FilterBar'
import AnalystCard from '@/components/wire/AnalystCard'

export const dynamic = 'force-dynamic'

export default async function WireHomePage() {
  const [featured, articles, analysts, regions, topics] = await Promise.all([
    getFeaturedArticles('wire'),
    getArticlesBySection('wire', 20),
    getAllAnalysts(),
    getAllRegions(),
    getAllTopics(),
  ])

  const tickerArticles = articles.slice(0, 5).map(a => ({ 
    title: a.title, slug: a.slug 
  }))

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <BreakingTicker articles={tickerArticles} />
      
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-8">
          {featured.length > 0 && (
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
          )}
        </section>

        <hr className="border-wire-border" />

        {/* Latest Analysis */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-white">
              Latest Analysis
            </h2>
          </div>
          <FilterBar regions={regions} topics={topics} basePath="/wire" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
            gap-6 mt-6">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} variant="grid" />
            ))}
          </div>
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

        {/* Newsletter CTA */}
        <section className="bg-wire-card border border-wire-border 
          rounded-xl p-8 my-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            Stay Ahead of the World
          </h2>
          <p className="text-wire-muted mb-6">
            Daily geopolitical briefings delivered to your inbox.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-wire-bg border border-wire-border rounded-lg 
                px-4 py-2 text-wire-text text-sm focus:outline-none 
                focus:border-wire-accent"
            />
            <button className="bg-wire-accent hover:bg-blue-600 text-white 
              px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

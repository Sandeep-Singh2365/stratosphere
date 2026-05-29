import { getFeaturedArticles, getArticlesBySection } from '@/lib/queries'
import { getAllAnalysts } from '@/lib/queries'
import { getAllTopics, getAllRegions } from '@/lib/queries'
import PaperCard from '@/components/institute/PaperCard'
import FellowCard from '@/components/institute/FellowCard'
import ResearchAreaCard from '@/components/institute/ResearchAreaCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function InstituteHomePage() {
  const [featured, papers, analysts, topics, regions] = await Promise.all([
    getFeaturedArticles('institute'),
    getArticlesBySection('institute', 20),
    getAllAnalysts(),
    getAllTopics(),
    getAllRegions(),
  ])

  const totalPapers = papers.length
  const totalFellows = analysts.length
  const totalAreas = topics.length

  return (
    <div>
      {/* Masthead */}
      <div className="text-center py-12 border-b border-institute-border mb-10">
        <p className="text-institute-muted text-xs tracking-widest uppercase 
          font-semibold mb-3">
          Independent Strategic Research
        </p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold 
          text-institute-text leading-tight mb-4">
          Stratosphere Institute<br />
          <span className="text-institute-accent">for Global Affairs</span>
        </h1>
        <p className="text-institute-muted max-w-xl mx-auto text-sm 
          leading-relaxed">
          Rigorous, non-partisan analysis of international security, 
          economics, and governance for policymakers and researchers.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Publications', value: totalPapers },
          { label: 'Fellows', value: totalFellows },
          { label: 'Research Areas', value: totalAreas },
        ].map(stat => (
          <div key={stat.label} 
            className="text-center p-4 bg-institute-card rounded-lg 
              border border-institute-border">
            <p className="text-3xl font-serif font-bold text-institute-accent">
              {stat.value}
            </p>
            <p className="text-institute-muted text-xs mt-1 uppercase 
              tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Featured Research */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-institute-text">
            Featured Research
          </h2>
          <Link href="/institute/briefs"
            className="text-institute-accent text-sm hover:underline">
            View all →
          </Link>
        </div>
        <div className="space-y-4">
          {featured.length > 0 && (
            <PaperCard article={featured[0]} variant="featured" />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {papers.slice(0, 4).map(paper => (
              <PaperCard key={paper.id} article={paper} variant="list" />
            ))}
          </div>
        </div>
      </section>

      <hr className="border-institute-border my-10" />

      {/* Research Areas */}
      <section className="mb-10">
        <h2 className="text-2xl font-serif font-bold text-institute-text mb-6">
          Research Areas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {topics.map(topic => (
            <ResearchAreaCard
              key={topic.id}
              name={topic.name}
              slug={topic.slug}
              color={topic.color}
              count={topic.article_count ?? 0}
              type="topic"
            />
          ))}
        </div>
      </section>

      <hr className="border-institute-border my-10" />

      {/* Fellows */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-institute-text">
            Contributing Fellows
          </h2>
          <Link href="/institute/fellows"
            className="text-institute-accent text-sm hover:underline">
            All Fellows →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {analysts.map(analyst => (
            <FellowCard key={analyst.id} analyst={analyst} />
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-amber-50 border border-amber-200 rounded-xl 
        p-8 my-8 text-center">
        <h2 className="text-2xl font-serif font-bold text-institute-text mb-2">
          Access Research Reports
        </h2>
        <p className="text-institute-muted mb-6 text-sm">
          Receive our quarterly policy briefs and strategic forecasts 
          directly in your inbox.
        </p>
        <div className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-white border border-institute-border 
              rounded-lg px-4 py-2 text-institute-text text-sm 
              focus:outline-none focus:border-institute-accent"
          />
          <button className="bg-institute-accent hover:bg-amber-900 
            text-white px-6 py-2 rounded-lg text-sm font-medium 
            transition-colors">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  )
}

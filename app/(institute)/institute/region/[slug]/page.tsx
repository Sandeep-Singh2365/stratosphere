import { getArticlesByRegion, getAllRegions } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PaperCard from '@/components/institute/PaperCard'

export const dynamic = 'force-dynamic'

export default async function InstituteRegionPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const [articles, regions] = await Promise.all([
    getArticlesByRegion(params.slug, 'institute'),
    getAllRegions(),
  ])
  const currentRegion = regions.find(r => r.slug === params.slug)
  if (!currentRegion) notFound()

  return (
    <div>
      <Link href="/institute"
        className="text-institute-muted hover:text-institute-text 
          text-sm mb-6 inline-block transition-colors">
        ← Institute Home
      </Link>
      <div className="flex items-center gap-3 mb-2">
        <span className="w-4 h-4 rounded-full"
          style={{ backgroundColor: currentRegion.color }} />
        <h1 className="text-3xl font-serif font-bold text-institute-text">
          {currentRegion.name}
        </h1>
      </div>
      <p className="text-institute-muted text-sm mb-8">
        {articles.length} publication{articles.length !== 1 ? 's' : ''}
      </p>
      <div className="space-y-4">
        {articles.map(article => (
          <PaperCard key={article.id} article={article} variant="list" />
        ))}
      </div>
    </div>
  )
}

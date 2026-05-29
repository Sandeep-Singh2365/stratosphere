import { getArticlesBySection } from '@/lib/queries'
import { getAllRegions, getAllTopics } from '@/lib/queries'
import PaperCard from '@/components/institute/PaperCard'

export const dynamic = 'force-dynamic'

export default async function BriefsPage() {
  const [papers, regions, topics] = await Promise.all([
    getArticlesBySection('institute', 50),
    getAllRegions(),
    getAllTopics(),
  ])

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-institute-text mb-3">
        Publications
      </h1>
      <p className="text-institute-muted text-sm mb-8">
        Policy papers, research reports, and strategic briefs 
        from Stratosphere Institute fellows.
      </p>
      <div className="space-y-4">
        {papers.map(paper => (
          <PaperCard key={paper.id} article={paper} variant="list" />
        ))}
      </div>
    </div>
  )
}

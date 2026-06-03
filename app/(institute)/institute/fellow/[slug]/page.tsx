import { getAnalystBySlug, getArticlesByAnalyst } from '@/lib/queries'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PaperCard from '@/components/institute/PaperCard'

export const dynamic = 'force-dynamic'

export default async function FellowPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const [analyst, articles] = await Promise.all([
    getAnalystBySlug(params.slug, 'institute'),
    getArticlesByAnalyst(params.slug),
  ])

  if (!analyst) notFound()

  const initials = analyst.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile header */}
      <div className="flex gap-6 items-start mb-8 pb-8 
        border-b border-institute-border">
        <Avatar className="w-24 h-24 flex-shrink-0">
          <AvatarImage src={analyst.photo_url} alt={analyst.name} />
          <AvatarFallback className="bg-amber-100 text-amber-800 
            text-2xl font-bold font-serif">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-serif font-bold text-institute-text 
            mb-1">
            {analyst.name}
          </h1>
          <p className="text-institute-accent font-medium text-sm mb-3">
            {analyst.title}
          </p>
          {analyst.bio && (
            <p className="text-institute-muted text-sm leading-relaxed">
              {analyst.bio}
            </p>
          )}
        </div>
      </div>

      {/* Publications */}
      {articles.length > 0 && (
        <section>
          <h2 className="text-xl font-serif font-bold text-institute-text mb-4">
            Publications
          </h2>
          <div className="space-y-3">
            {articles.map(article => (
              <PaperCard key={article.id} article={article} variant="list" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

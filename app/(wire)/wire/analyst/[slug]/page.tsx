import { getAnalystBySlug, getArticlesByAnalyst } from '@/lib/queries'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ArticleCard from '@/components/wire/ArticleCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function WireAnalystPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const [analyst, articles] = await Promise.all([
    getAnalystBySlug(params.slug, 'wire'),
    getArticlesByAnalyst(params.slug),
  ])
  if (!analyst) notFound()

  const initials = analyst.name
    .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/wire/experts"
        className="text-wire-muted hover:text-white text-sm mb-6 
          inline-block transition-colors">
        ← All Experts
      </Link>
      <div className="flex gap-6 items-start mb-8 pb-8 
        border-b border-wire-border">
        <Avatar className="w-20 h-20 flex-shrink-0">
          <AvatarImage src={analyst.photo_url} alt={analyst.name} />
          <AvatarFallback className="bg-wire-card text-wire-accent 
            text-xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-1">
            {analyst.name}
          </h1>
          <p className="text-wire-accent font-medium text-sm mb-3">
            {analyst.title}
          </p>
          {analyst.bio && (
            <p className="text-wire-muted text-sm leading-relaxed">
              {analyst.bio}
            </p>
          )}
        </div>
      </div>
      {articles.length > 0 && (
        <section>
          <h2 className="text-xl font-serif font-bold text-white mb-4">
            Analysis by {analyst.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
            gap-6">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} 
                variant="grid" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

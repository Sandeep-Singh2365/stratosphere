import { getArticleBySlug, getArticlesByRegion } from '@/lib/queries'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import ArticleCard from '@/components/wire/ArticleCard'
import { marked } from 'marked'
import { ArticleWithMeta } from '@/types'

export const dynamic = 'force-dynamic'

export default async function ArticlePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const article = await getArticleBySlug(params.slug)
  if (!article) notFound()

  const htmlContent = await marked.parse(article.content || '')

  let related: ArticleWithMeta[] = []
  if (article.regions[0]) {
    const regionArticles = await getArticlesByRegion(
      article.regions[0].slug, 'wire'
    )
    related = regionArticles
      .filter(a => a.id !== article.id)
      .slice(0, 3)
  }

  return (
    <article className="max-w-3xl mx-auto">
      {/* Cover */}
      {article.cover_image ? (
        <img
          src={article.cover_image}
          alt={article.title}
          className="w-full h-72 object-cover rounded-xl mb-8"
        />
      ) : (
        <div className="h-48 rounded-xl bg-gradient-to-br 
          from-blue-900 to-slate-800 mb-8" />
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {article.regions.map(r => (
          <Badge key={r.id} variant="outline"
            className="text-xs border-blue-500 text-blue-400">
            {r.name}
          </Badge>
        ))}
        {article.topics.map(t => (
          <Badge key={t.id} variant="outline"
            className="text-xs border-purple-500 text-purple-400">
            {t.name}
          </Badge>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-4xl font-serif font-bold text-white 
        leading-tight mb-4">
        {article.title}
      </h1>

      {/* Byline */}
      <div className="flex items-center gap-4 mb-6">
        {article.analyst_name && (
          <span className="text-wire-accent font-medium">
            {article.analyst_name}
          </span>
        )}
        <span className="text-wire-muted text-sm">
          {formatDate(article.published_at)}
        </span>
        <span className="text-wire-muted text-sm">
          {article.read_time} min read
        </span>
      </div>

      <hr className="border-wire-border mb-8" />

      {/* Body */}
      <div
        className="prose-wire max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Related */}
      {related.length > 0 && (
        <aside className="mt-12 border-t border-wire-border pt-8">
          <h3 className="text-lg font-serif font-bold text-white mb-4">
            Related Analysis
          </h3>
          <div className="flex flex-col gap-4">
            {related.map(r => (
              <ArticleCard key={r.id} article={r} variant="list" />
            ))}
          </div>
        </aside>
      )}
    </article>
  )
}

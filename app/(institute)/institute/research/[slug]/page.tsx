import { getArticleBySlug } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { marked } from 'marked'
import { ArticleWithMeta } from '@/types'

export const dynamic = 'force-dynamic'

const contentTypeLabels: Record<string, string> = {
  paper: 'Policy Paper',
  report: 'Research Report',
  brief: 'Policy Brief',
  analysis: 'Analysis',
  interview: 'Interview',
}

export default async function ResearchPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const article = await getArticleBySlug(params.slug)
  if (!article) notFound()

  const htmlContent = await marked.parse(article.content || '')
  const typeLabel = contentTypeLabels[article.content_type ?? ''] 
    ?? article.content_type ?? 'Publication'

  return (
    <article className="max-w-3xl mx-auto">
      {/* Content type + badges */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Badge className="bg-amber-100 text-amber-800 font-semibold 
          border-0">
          {typeLabel}
        </Badge>
        {article.regions.map(r => (
          <Link key={r.id} href={`/institute/region/${r.slug}`}>
            <Badge variant="outline"
              className="border-stone-300 text-stone-500 hover:bg-stone-100 transition-colors text-xs">
              {r.name}
            </Badge>
          </Link>
        ))}
        {article.topics.map(t => (
          <Link key={t.id} href={`/institute/topic/${t.slug}`}>
            <Badge variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors text-xs">
              {t.name}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-4xl font-serif font-bold text-institute-text 
        leading-tight mb-6">
        {article.title}
      </h1>

      {/* Abstract box */}
      {article.abstract && (
        <div className="bg-amber-50 border-l-4 border-institute-accent 
          rounded-r-lg p-5 mb-6">
          <p className="text-xs font-semibold text-institute-accent 
            uppercase tracking-wide mb-2">
            Abstract
          </p>
          <p className="text-institute-text text-sm leading-relaxed 
            font-serif italic">
            {article.abstract}
          </p>
        </div>
      )}

      {/* Byline + PDF */}
      <div className="flex items-center justify-between 
        border-b border-institute-border pb-6 mb-8">
        <div className="flex items-center gap-4">
          {article.analyst_name && (
            article.analyst_slug ? (
              <Link href={`/institute/fellow/${article.analyst_slug}`}
                className="text-institute-accent font-medium text-sm hover:underline">
                {article.analyst_name}
              </Link>
            ) : (
              <span className="text-institute-accent font-medium text-sm">
                {article.analyst_name}
              </span>
            )
          )}
          <span className="text-institute-muted text-sm">
            {formatDate(article.published_at)}
          </span>
          <span className="text-institute-muted text-sm">
            {article.read_time} min read
          </span>
        </div>
        {article.pdf_url && !article.pdf_url.startsWith('/papers/') && (
          <a
            href={article.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-institute-accent text-white text-xs px-4 py-2 
              rounded-lg hover:bg-amber-900 transition-colors font-medium"
          >
            ↓ Download PDF
          </a>
        )}
      </div>

      {/* Body */}
      <div
        className="prose-institute max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Citation placeholder */}
      <div className="mt-12 border-t border-institute-border pt-8">
        <h3 className="text-sm font-semibold text-institute-muted 
          uppercase tracking-wide mb-3">
          How to Cite
        </h3>
        <p className="text-institute-muted text-xs font-mono leading-relaxed 
          bg-stone-50 border border-institute-border rounded-lg p-4">
          {article.analyst_name ?? 'Stratosphere Institute'}. 
          &ldquo;{article.title}.&rdquo; 
          Stratosphere Institute for Global Affairs, {formatDate(article.published_at)}.
        </p>
      </div>
    </article>
  )
}

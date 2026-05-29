import Link from 'next/link'
import { ArticleWithMeta } from '@/types'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PaperCardProps {
  article: ArticleWithMeta
  variant: 'featured' | 'list' | 'compact'
}

const contentTypeLabels: Record<string, string> = {
  paper: 'Policy Paper',
  report: 'Research Report',
  brief: 'Policy Brief',
  analysis: 'Analysis',
  interview: 'Interview',
}

export default function PaperCard({ article, variant }: PaperCardProps) {
  const typeLabel = contentTypeLabels[article.content_type ?? ''] 
    ?? article.content_type ?? 'Publication'

  if (variant === 'featured') {
    return (
      <div className="bg-institute-card rounded-xl border-l-4 
        border-institute-accent border border-institute-border p-6 
        hover:shadow-md transition-shadow">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge className="bg-amber-100 text-amber-800 text-xs 
            font-semibold border-0">
            {typeLabel}
          </Badge>
          {article.regions.slice(0, 2).map(r => (
            <Link key={r.id} href={`/institute/region/${r.slug}`}>
              <Badge variant="outline"
                className="text-xs border-stone-300 text-stone-500 hover:bg-stone-100 transition-colors">
                {r.name}
              </Badge>
            </Link>
          ))}
          {article.topics.slice(0, 2).map(t => (
            <Link key={t.id} href={`/institute/topic/${t.slug}`}>
              <Badge variant="outline"
                className="text-xs border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors">
                {t.name}
              </Badge>
            </Link>
          ))}
        </div>
        <Link href={`/institute/research/${article.slug}`}>
          <h2 className="text-2xl font-serif font-bold text-institute-text 
            leading-tight mb-3 hover:text-institute-accent transition-colors">
            {article.title}
          </h2>
        </Link>
        <p className="text-institute-muted text-sm leading-relaxed 
          line-clamp-3 mb-4">
          {article.abstract}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            {article.analyst_name && (
              article.analyst_slug ? (
                <Link href={`/institute/fellow/${article.analyst_slug}`}
                  className="text-institute-accent font-medium hover:underline">
                  {article.analyst_name}
                </Link>
              ) : (
                <span className="text-institute-accent font-medium">
                  {article.analyst_name}
                </span>
              )
            )}
            <span className="text-institute-muted">
              {formatDate(article.published_at)}
            </span>
            <span className="text-institute-muted">
              {article.read_time} min read
            </span>
          </div>
          {article.pdf_url && !article.pdf_url.startsWith('/papers/') && (
            <a
              href={article.pdf_url}
              className="text-xs text-institute-accent hover:underline 
                font-medium flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              ↓ PDF
            </a>
          )}
        </div>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className="flex gap-6 p-5 bg-institute-card rounded-lg border 
        border-institute-border hover:border-institute-accent 
        hover:shadow-sm transition-all">
        <div className="flex-shrink-0 w-28 text-center">
          <Badge className="bg-amber-100 text-amber-800 text-xs 
            font-semibold border-0 whitespace-normal text-center break-words leading-tight">
            {typeLabel}
          </Badge>
          <p className="text-institute-muted text-xs mt-2">
            {formatDate(article.published_at)}
          </p>
          {article.pdf_url && !article.pdf_url.startsWith('/papers/') && (
            <a href={article.pdf_url}
              className="text-xs text-institute-accent hover:underline 
                mt-1 inline-block"
              target="_blank" rel="noopener noreferrer">
              ↓ PDF
            </a>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1 mb-2">
            {article.topics.slice(0, 2).map(t => (
              <Link key={t.id} href={`/institute/topic/${t.slug}`}>
                <Badge variant="outline"
                  className="text-xs border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors">
                  {t.name}
                </Badge>
              </Link>
            ))}
          </div>
          <Link href={`/institute/research/${article.slug}`}>
            <h3 className="text-base font-serif font-bold 
              text-institute-text leading-snug mb-2 
              hover:text-institute-accent transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>
          <p className="text-institute-muted text-xs leading-relaxed 
            line-clamp-2">
            {article.abstract}
          </p>
          {article.analyst_name && (
            article.analyst_slug ? (
              <Link href={`/institute/fellow/${article.analyst_slug}`}
                className="text-institute-accent text-xs font-medium mt-2 hover:underline">
                {article.analyst_name}
              </Link>
            ) : (
              <p className="text-institute-accent text-xs font-medium mt-2">
                {article.analyst_name}
              </p>
            )
          )}
        </div>
      </div>
    )
  }

  // compact variant
  return (
    <div className="py-3 border-b border-institute-border last:border-0">
      <Link href={`/institute/research/${article.slug}`}>
        <h4 className="text-sm font-serif font-semibold text-institute-text 
          hover:text-institute-accent transition-colors line-clamp-2 mb-1">
          {article.title}
        </h4>
      </Link>
      <div className="flex items-center gap-2 text-xs text-institute-muted">
        {article.analyst_name && (
          article.analyst_slug ? (
            <Link href={`/institute/fellow/${article.analyst_slug}`}
              className="hover:underline text-institute-accent font-medium">
              {article.analyst_name}
            </Link>
          ) : (
            <span>{article.analyst_name}</span>
          )
        )}
        <span>·</span>
        <span>{formatDate(article.published_at)}</span>
      </div>
    </div>
  )
}

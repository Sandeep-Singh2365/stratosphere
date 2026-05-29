'use client'
import Link from 'next/link'
import { ArticleWithMeta } from '@/types'
import { cn, truncate, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface ArticleCardProps {
  article: ArticleWithMeta
  variant: 'featured' | 'grid' | 'list'
}

export default function ArticleCard({ article, variant }: ArticleCardProps) {
  const CoverImage = () => {
    if (article.cover_image) {
      return (
        <img
          src={article.cover_image}
          alt={article.title}
          className={cn(
            'w-full object-cover',
            variant === 'featured' ? 'h-64' : variant === 'grid' ? 'h-44' : 'w-24 h-20 rounded flex-shrink-0'
          )}
        />
      )
    }
    return (
      <div
        className={cn(
          'bg-gradient-to-br from-blue-900 to-slate-800 flex-shrink-0',
          variant === 'featured' ? 'h-64 w-full' : variant === 'grid' ? 'h-32 w-full' : 'w-24 h-20 rounded'
        )}
      />
    )
  }

  if (variant === 'featured') {
    return (
      <div className="bg-wire-card rounded-xl overflow-hidden border border-wire-border">
        <CoverImage />
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {article.regions.slice(0, 2).map(r => (
              <Badge key={r.id} variant="outline"
                className="text-xs border-blue-500 text-blue-400">
                {r.name}
              </Badge>
            ))}
            {article.topics.slice(0, 2).map(t => (
              <Badge key={t.id} variant="outline"
                className="text-xs border-purple-500 text-purple-400">
                {t.name}
              </Badge>
            ))}
          </div>
          <Link href={`/wire/article/${article.slug}`}>
            <h2 className="text-2xl font-serif font-bold text-white 
              leading-tight mb-3 hover:text-wire-accent transition-colors">
              {article.title}
            </h2>
          </Link>
          <p className="text-wire-muted text-sm leading-relaxed line-clamp-3 mb-4">
            {article.abstract}
          </p>
          <div className="flex items-center gap-3 text-xs">
            {article.analyst_name && (
              <span className="text-wire-accent font-medium">
                {article.analyst_name}
              </span>
            )}
            <span className="text-wire-muted">
              {article.read_time} min read
            </span>
            <span className="text-wire-muted">
              {formatDate(article.published_at)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'grid') {
    return (
      <div className="bg-wire-card rounded-lg overflow-hidden border 
        border-wire-border hover:border-wire-accent transition-colors">
        <CoverImage />
        <div className="p-4">
          {article.regions[0] && (
            <Badge variant="outline"
              className="text-xs border-blue-500 text-blue-400 mb-2">
              {article.regions[0].name}
            </Badge>
          )}
          <Link href={`/wire/article/${article.slug}`}>
            <h3 className="text-lg font-serif font-semibold text-white 
              leading-snug mb-2 line-clamp-2 hover:text-wire-accent 
              transition-colors">
              {article.title}
            </h3>
          </Link>
          <p className="text-wire-muted text-xs leading-relaxed 
            line-clamp-2 mb-3">
            {article.abstract}
          </p>
          <div className="flex items-center gap-2 text-xs">
            {article.analyst_name && (
              <span className="text-wire-accent">{article.analyst_name}</span>
            )}
            <span className="text-wire-muted">·</span>
            <span className="text-wire-muted">{article.read_time} min read</span>
          </div>
        </div>
      </div>
    )
  }

  // list variant
  return (
    <div className="flex gap-4 p-4 bg-wire-card rounded-lg border 
      border-wire-border hover:border-wire-accent transition-colors">
      <CoverImage />
      <div className="flex-1 min-w-0">
        {article.regions[0] && (
          <Badge variant="outline"
            className="text-xs border-blue-500 text-blue-400 mb-1">
            {article.regions[0].name}
          </Badge>
        )}
        <Link href={`/wire/article/${article.slug}`}>
          <h4 className="text-sm font-serif font-semibold text-white 
            line-clamp-2 mt-1 mb-2 hover:text-wire-accent transition-colors">
            {article.title}
          </h4>
        </Link>
        <div className="flex items-center gap-2 text-xs text-wire-muted">
          {article.analyst_name && (
            <span>{article.analyst_name}</span>
          )}
          <span>·</span>
          <span>{formatDate(article.published_at)}</span>
        </div>
      </div>
    </div>
  )
}

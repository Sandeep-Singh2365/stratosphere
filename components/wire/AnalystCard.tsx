import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Analyst } from '@/types'

interface AnalystCardProps {
  analyst: Analyst
}

export default function AnalystCard({ analyst }: AnalystCardProps) {
  const initials = analyst.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Link href={`/wire/analyst/${analyst.slug}`}>
      <div className="flex flex-col items-center p-4 bg-wire-card rounded-lg 
        border border-wire-border hover:border-wire-accent transition-colors 
        text-center w-36">
        <Avatar className="w-16 h-16">
          <AvatarImage src={analyst.photo_url} alt={analyst.name} />
          <AvatarFallback className="bg-wire-bg text-wire-accent text-sm font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <p className="text-sm font-semibold text-white mt-2 line-clamp-2 
          leading-tight">
          {analyst.name}
        </p>
        <p className="text-xs text-wire-muted line-clamp-2 mt-1 leading-tight">
          {analyst.title}
        </p>
        {analyst.article_count !== undefined && analyst.article_count > 0 && (
          <Badge variant="outline" 
            className="text-xs mt-2 border-wire-border text-wire-muted">
            {analyst.article_count} articles
          </Badge>
        )}
      </div>
    </Link>
  )
}

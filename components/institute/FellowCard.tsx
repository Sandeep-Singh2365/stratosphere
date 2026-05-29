import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Analyst } from '@/types'

interface FellowCardProps {
  analyst: Analyst
}

export default function FellowCard({ analyst }: FellowCardProps) {
  const initials = analyst.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Link href={`/institute/fellow/${analyst.slug}`}>
      <div className="bg-institute-card rounded-xl border border-institute-border 
        hover:border-institute-accent hover:shadow-sm transition-all p-6 
        flex flex-col items-center text-center">
        <Avatar className="w-20 h-20 mb-4">
          <AvatarImage src={analyst.photo_url} alt={analyst.name} />
          <AvatarFallback className="bg-amber-100 text-amber-800 
            text-lg font-bold font-serif">
            {initials}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-base font-serif font-bold text-institute-text 
          mb-1 leading-tight">
          {analyst.name}
        </h3>
        <p className="text-institute-muted text-xs leading-snug mb-3">
          {analyst.title}
        </p>
        {analyst.article_count !== undefined && analyst.article_count > 0 && (
          <Badge variant="outline" 
            className="text-xs border-amber-300 text-amber-700">
            {analyst.article_count} publications
          </Badge>
        )}
      </div>
    </Link>
  )
}

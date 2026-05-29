'use client'
import Link from 'next/link'

interface TickerProps {
  articles: { title: string; slug: string }[]
}

export default function BreakingTicker({ articles }: TickerProps) {
  const items = [...articles, ...articles]
  return (
    <div className="bg-wire-accent text-white overflow-hidden relative flex 
      items-center h-9">
      <div className="flex-shrink-0 bg-blue-700 px-4 h-full flex items-center 
        z-10 relative">
        <span className="text-xs font-bold tracking-widest uppercase">
          Latest
        </span>
        <span className="ml-3 text-blue-300">|</span>
      </div>
      <div className="flex animate-ticker ticker-pause whitespace-nowrap" style={{ animationDuration: '60s' }}>
        {items.map((article, i) => (
          <Link
            key={i}
            href={`/wire/article/${article.slug}`}
            className="inline-block px-6 text-sm hover:text-blue-200 
              transition-colors"
          >
            {article.title}
            <span className="mx-4 text-blue-300">·</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

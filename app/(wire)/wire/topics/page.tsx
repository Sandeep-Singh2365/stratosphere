import { getAllTopics } from '@/lib/queries'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function TopicsPage() {
  const topics = await getAllTopics()
  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">
        Topics
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {topics.map(topic => (
          <Link key={topic.id} href={`/wire/topic/${topic.slug}`}>
            <div className="rounded-xl p-6 border border-wire-border 
              bg-wire-card hover:border-wire-accent transition-colors">
              <div className="flex items-center mb-2">
                <span
                  className="w-3 h-3 rounded-full inline-block mr-2 
                    flex-shrink-0"
                  style={{ backgroundColor: topic.color }}
                />
                <span className="text-white font-semibold text-sm">
                  {topic.name}
                </span>
              </div>
              <p className="text-wire-muted text-xs">
                {topic.article_count ?? 0} articles
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

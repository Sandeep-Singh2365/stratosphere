import { getAllRegions } from '@/lib/queries'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function RegionsPage() {
  const regions = await getAllRegions()
  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">
        Regions
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {regions.map(region => (
          <Link key={region.id} href={`/wire/region/${region.slug}`}>
            <div className="rounded-xl p-6 border border-wire-border 
              bg-wire-card hover:border-wire-accent transition-colors">
              <div className="flex items-center mb-2">
                <span
                  className="w-3 h-3 rounded-full inline-block mr-2 
                    flex-shrink-0"
                  style={{ backgroundColor: region.color }}
                />
                <span className="text-white font-semibold text-sm">
                  {region.name}
                </span>
              </div>
              <p className="text-wire-muted text-xs">
                {region.article_count ?? 0} articles
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

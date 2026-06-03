import { getAllAnalysts } from '@/lib/queries'
import FellowCard from '@/components/institute/FellowCard'

export const dynamic = 'force-dynamic'

export default async function FellowsPage() {
  const analysts = await getAllAnalysts('institute')
  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-institute-text mb-3">
        Research Fellows
      </h1>
      <p className="text-institute-muted text-sm mb-8">
        Stratosphere Institute scholars and policy researchers.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {analysts.map(analyst => (
          <FellowCard key={analyst.id} analyst={analyst} />
        ))}
      </div>
    </div>
  )
}

import { getAllAnalysts } from '@/lib/queries'
import AnalystCard from '@/components/wire/AnalystCard'

export const dynamic = 'force-dynamic'

export default async function ExpertsPage() {
  const analysts = await getAllAnalysts('wire')
  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">
        Contributing Experts
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {analysts.map(analyst => (
          <AnalystCard key={analyst.id} analyst={analyst} />
        ))}
      </div>
    </div>
  )
}

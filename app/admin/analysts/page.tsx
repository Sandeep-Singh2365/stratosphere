import { getAllAnalysts } from '@/lib/queries'
import { deleteAnalystAction } from '@/app/actions/analysts'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AnalystsPage() {
  const analysts = await getAllAnalysts()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Analysts</h1>
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700 
        overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              {['Name', 'Title', 'Articles', 'Actions'].map(h => (
                <th key={h} className="text-left text-slate-400 text-xs 
                  font-medium px-4 py-3 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {analysts.map(analyst => (
              <tr key={analyst.id}
                className="border-b border-slate-700/50 
                  hover:bg-slate-700/30">
                <td className="px-4 py-3 text-white text-sm font-medium">
                  {analyst.name}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {analyst.title}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {analyst.article_count ?? 0}
                </td>
                <td className="px-4 py-3">
                  <form action={async () => {
                    'use server'
                    await deleteAnalystAction(analyst.id)
                  }}>
                    <button type="submit"
                      className="text-red-400 hover:underline text-xs">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

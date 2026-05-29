import { getAllSubscribers } from '@/lib/queries'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function SubscribersPage() {
  const subscribers = await getAllSubscribers()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Subscribers</h1>
        <p className="text-slate-400 text-sm">
          {subscribers.length} total
        </p>
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700 
        overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              {['Email', 'Subscribed', 'Status'].map(h => (
                <th key={h} className="text-left text-slate-400 text-xs 
                  font-medium px-4 py-3 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subscribers.map(sub => (
              <tr key={sub.id}
                className="border-b border-slate-700/50">
                <td className="px-4 py-3 text-white text-sm">
                  {sub.email}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {formatDate(sub.subscribed_at)}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full 
                    font-medium ${sub.is_active
                      ? 'bg-green-900 text-green-300'
                      : 'bg-slate-700 text-slate-400'}`}>
                    {sub.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

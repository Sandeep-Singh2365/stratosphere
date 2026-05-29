import { getAllArticlesAdmin } from '@/lib/queries'
import { getAllSubscribers } from '@/lib/queries'
import { getAllAnalysts } from '@/lib/queries'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [articles, subscribers, analysts] = await Promise.all([
    getAllArticlesAdmin(),
    getAllSubscribers(),
    getAllAnalysts(),
  ])

  const published = articles.filter(a => a.is_published)
  const wire = articles.filter(a => a.section === 'wire')
  const institute = articles.filter(a => a.section === 'institute')
  const recent = articles.slice(0, 10)

  const stats = [
    { label: 'Total Articles', value: articles.length },
    { label: 'Published', value: published.length },
    { label: 'Wire', value: wire.length },
    { label: 'Institute', value: institute.length },
    { label: 'Subscribers', value: subscribers.length },
    { label: 'Analysts', value: analysts.length },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/admin/articles/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 
              rounded-lg text-sm font-medium transition-colors">
            + New Article
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label}
            className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-slate-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent articles table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-4 border-b border-slate-700 flex items-center 
          justify-between">
          <h2 className="text-white font-semibold">Recent Articles</h2>
          <Link href="/admin/articles"
            className="text-blue-400 text-sm hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 text-xs font-medium 
                  px-4 py-3 uppercase tracking-wide">Title</th>
                <th className="text-left text-slate-400 text-xs font-medium 
                  px-4 py-3 uppercase tracking-wide">Section</th>
                <th className="text-left text-slate-400 text-xs font-medium 
                  px-4 py-3 uppercase tracking-wide">Status</th>
                <th className="text-left text-slate-400 text-xs font-medium 
                  px-4 py-3 uppercase tracking-wide">Date</th>
                <th className="text-left text-slate-400 text-xs font-medium 
                  px-4 py-3 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(article => (
                <tr key={article.id}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="px-4 py-3">
                    <p className="text-white text-sm font-medium 
                      line-clamp-1 max-w-xs">
                      {article.title}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full 
                      font-medium ${article.section === 'wire' 
                        ? 'bg-blue-900 text-blue-300' 
                        : 'bg-amber-900 text-amber-300'}`}>
                      {article.section}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full 
                      font-medium ${article.is_published 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-slate-700 text-slate-400'}`}>
                      {article.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {formatDate(article.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="text-blue-400 hover:underline text-xs"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import { getAllArticlesAdmin } from '@/lib/queries'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { publishArticleAction, deleteArticleAction, 
  toggleFeaturedAction } from '@/app/actions/articles'

export const dynamic = 'force-dynamic'

export default async function ArticlesPage() {
  const articles = await getAllArticlesAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Articles</h1>
        <Link href="/admin/articles/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 
            rounded-lg text-sm font-medium transition-colors">
          + New Article
        </Link>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 
        overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                {['Title','Section','Type','Status','Featured',
                  'Date','Actions'].map(h => (
                  <th key={h} className="text-left text-slate-400 text-xs 
                    font-medium px-4 py-3 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id}
                  className="border-b border-slate-700/50 
                    hover:bg-slate-700/30">
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-white text-sm font-medium 
                      line-clamp-1">
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
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {article.content_type}
                  </td>
                  <td className="px-4 py-3">
                    <form action={async () => {
                      'use server'
                      await publishArticleAction(article.id)
                    }}>
                      <button type="submit"
                        className={`text-xs px-2 py-1 rounded-full 
                          font-medium cursor-pointer ${
                          article.is_published
                            ? 'bg-green-900 text-green-300'
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }`}>
                        {article.is_published ? 'Published' : 'Draft'}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <form action={async () => {
                      'use server'
                      await toggleFeaturedAction(
                        article.id, !article.is_featured
                      )
                    }}>
                      <button type="submit"
                        className={`text-xs px-2 py-1 rounded-full 
                          cursor-pointer ${
                          article.is_featured
                            ? 'bg-yellow-900 text-yellow-300'
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }`}>
                        {article.is_featured ? '★ Featured' : '☆ Feature'}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {formatDate(article.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="text-blue-400 hover:underline text-xs">
                        Edit
                      </Link>
                      <form action={async () => {
                        'use server'
                        await deleteArticleAction(article.id)
                      }}>
                        <button type="submit"
                          className="text-red-400 hover:underline text-xs">
                          Delete
                        </button>
                      </form>
                    </div>
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

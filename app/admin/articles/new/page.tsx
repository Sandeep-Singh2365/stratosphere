import { getAllAnalysts, getAllRegions, getAllTopics } from '@/lib/queries'
import ArticleForm from '@/components/admin/ArticleForm'

export const dynamic = 'force-dynamic'

export default async function NewArticlePage() {
  const [analysts, regions, topics] = await Promise.all([
    getAllAnalysts(),
    getAllRegions(),
    getAllTopics(),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">New Article</h1>
      <ArticleForm analysts={analysts} regions={regions} topics={topics} />
    </div>
  )
}

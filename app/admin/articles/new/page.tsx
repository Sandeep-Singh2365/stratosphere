import { getAllAnalysts, getAllArticlesAdmin, getAllRegions, getAllTopics } from '@/lib/queries'
import ArticleForm from '@/components/admin/ArticleForm'

export const dynamic = 'force-dynamic'

export default async function NewArticlePage() {
  const [articles, analysts, regions, topics] = await Promise.all([
    getAllArticlesAdmin(),
    getAllAnalysts(),
    getAllRegions(),
    getAllTopics(),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">New Article</h1>
      <ArticleForm
        allArticles={articles}
        analysts={analysts}
        regions={regions}
        topics={topics}
      />
    </div>
  )
}

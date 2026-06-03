import { getAllArticlesAdmin, getAllAnalysts, 
  getAllRegions, getAllTopics } from '@/lib/queries'
import ArticleForm from '@/components/admin/ArticleForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const [articles, analysts, regions, topics] = await Promise.all([
    getAllArticlesAdmin(),
    getAllAnalysts(),
    getAllRegions(),
    getAllTopics(),
  ])

  const article = articles.find(a => a.id === params.id)
  if (!article) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Edit Article</h1>
      <ArticleForm
        article={article}
        allArticles={articles}
        analysts={analysts}
        regions={regions}
        topics={topics}
      />
    </div>
  )
}

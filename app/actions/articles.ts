'use server'
import { createArticle, updateArticle, deleteArticle, 
  publishArticle, toggleFeatured } from '@/lib/queries/admin'
import { ArticleInsert } from '@/lib/queries/admin'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function createArticleAction(data: ArticleInsert) {
  const article = await createArticle(data)
  revalidateTag('articles')
  revalidatePath('/wire')
  revalidatePath('/institute')
  revalidatePath('/admin/articles')
  return article
}

export async function updateArticleAction(
  id: string, data: Partial<ArticleInsert>
) {
  const article = await updateArticle(id, data)
  revalidateTag('articles')
  revalidatePath('/wire')
  revalidatePath('/institute')
  revalidatePath('/admin/articles')
  return article
}

export async function deleteArticleAction(id: string) {
  await deleteArticle(id)
  revalidatePath('/admin/articles')
}

export async function publishArticleAction(id: string) {
  await publishArticle(id)
  revalidateTag('articles')
  revalidatePath('/admin/articles')
  revalidatePath('/wire')
  revalidatePath('/institute')
}

export async function toggleFeaturedAction(id: string, value: boolean) {
  await toggleFeatured(id, value)
  revalidateTag('articles')
  revalidatePath('/admin/articles')
  revalidatePath('/wire')
  revalidatePath('/institute')
}

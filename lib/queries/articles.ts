/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db';
import { ArticleWithMeta, Region, Topic } from '@/types';
import { unstable_cache } from 'next/cache';

async function enrichArticles(articles: any[]): Promise<ArticleWithMeta[]> {
  if (articles.length === 0) return []
  
  const ids = articles.map(a => a.id)
  
  // Batch fetch all regions for all articles in 2 queries instead of 2N
  const allRegionRows = await sql`
    SELECT ar.article_id, r.id, r.name, r.slug, r.color
    FROM article_regions ar
    JOIN regions r ON r.id = ar.region_id
    WHERE ar.article_id = ANY(${ids}::uuid[])
  `
  const allTopicRows = await sql`
    SELECT at.article_id, t.id, t.name, t.slug, t.color
    FROM article_topics at
    JOIN topics t ON t.id = at.topic_id
    WHERE at.article_id = ANY(${ids}::uuid[])
  `

  const regionsByArticle = new Map<string, Region[]>()
  const topicsByArticle = new Map<string, Topic[]>()

  allRegionRows.forEach((row: any) => {
    const existing = regionsByArticle.get(row.article_id) ?? []
    existing.push({ id: row.id, name: row.name, slug: row.slug, color: row.color })
    regionsByArticle.set(row.article_id, existing)
  })

  allTopicRows.forEach((row: any) => {
    const existing = topicsByArticle.get(row.article_id) ?? []
    existing.push({ id: row.id, name: row.name, slug: row.slug, color: row.color })
    topicsByArticle.set(row.article_id, existing)
  })

  return articles.map(article => ({
    ...article,
    regions: regionsByArticle.get(article.id) ?? [],
    topics: topicsByArticle.get(article.id) ?? [],
  }))
}

export const getFeaturedArticles = unstable_cache(
  async (section: 'wire' | 'institute') => {
    const result = await sql`
      SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
      FROM articles 
      LEFT JOIN analysts ON articles.analyst_id = analysts.id 
      WHERE articles.section = ${section} AND articles.is_featured = true 
      AND articles.is_published = true 
      ORDER BY articles.published_at DESC LIMIT 3
    `;
    return enrichArticles(result);
  },
  ['featured-articles'],
  { revalidate: 300, tags: ['articles'] } // 5 min cache
)

export const getArticlesBySection = unstable_cache(
  async (section: 'wire' | 'institute', limit = 20) => {
    const result = await sql`
      SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
      FROM articles 
      LEFT JOIN analysts ON articles.analyst_id = analysts.id 
      WHERE articles.section = ${section} AND articles.is_published = true 
      ORDER BY articles.published_at DESC LIMIT ${limit}
    `;
    return enrichArticles(result);
  },
  ['articles-by-section'],
  { revalidate: 300, tags: ['articles'] }
)

export async function getArticleBySlug(slug: string): Promise<ArticleWithMeta | null> {
  const result = await sql`
    SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
    FROM articles 
    LEFT JOIN analysts ON articles.analyst_id = analysts.id 
    WHERE articles.slug = ${slug} AND articles.is_published = true
  `;
  if (result.length === 0) return null;
  const enriched = await enrichArticles(result);
  return enriched[0];
}

export async function getArticlesByRegion(regionSlug: string, section?: string): Promise<ArticleWithMeta[]> {
  let result;
  if (section) {
    result = await sql`
      SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
      FROM articles 
      LEFT JOIN analysts ON articles.analyst_id = analysts.id 
      JOIN article_regions ar ON ar.article_id = articles.id 
      JOIN regions r ON r.id = ar.region_id 
      WHERE r.slug = ${regionSlug} AND articles.is_published = true 
      AND articles.section = ${section}
      ORDER BY articles.published_at DESC
    `;
  } else {
    result = await sql`
      SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
      FROM articles 
      LEFT JOIN analysts ON articles.analyst_id = analysts.id 
      JOIN article_regions ar ON ar.article_id = articles.id 
      JOIN regions r ON r.id = ar.region_id 
      WHERE r.slug = ${regionSlug} AND articles.is_published = true
      ORDER BY articles.published_at DESC
    `;
  }
  return enrichArticles(result);
}

export async function getArticlesByTopic(topicSlug: string, section?: string): Promise<ArticleWithMeta[]> {
  let result;
  if (section) {
    result = await sql`
      SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
      FROM articles 
      LEFT JOIN analysts ON articles.analyst_id = analysts.id 
      JOIN article_topics at ON at.article_id = articles.id 
      JOIN topics t ON t.id = at.topic_id 
      WHERE t.slug = ${topicSlug} AND articles.is_published = true 
      AND articles.section = ${section}
      ORDER BY articles.published_at DESC
    `;
  } else {
    result = await sql`
      SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
      FROM articles 
      LEFT JOIN analysts ON articles.analyst_id = analysts.id 
      JOIN article_topics at ON at.article_id = articles.id 
      JOIN topics t ON t.id = at.topic_id 
      WHERE t.slug = ${topicSlug} AND articles.is_published = true
      ORDER BY articles.published_at DESC
    `;
  }
  return enrichArticles(result);
}

export async function getArticlesByAnalyst(analystSlug: string): Promise<ArticleWithMeta[]> {
  const result = await sql`
    SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
    FROM articles 
    JOIN analysts ON articles.analyst_id = analysts.id 
    WHERE analysts.slug = ${analystSlug} AND articles.is_published = true
    ORDER BY articles.published_at DESC
  `;
  return enrichArticles(result);
}

export async function searchArticles(query: string): Promise<ArticleWithMeta[]> {
  const queryPattern = `%${query}%`;
  const result = await sql`
    SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
    FROM articles 
    LEFT JOIN analysts ON articles.analyst_id = analysts.id 
    WHERE (articles.title ILIKE ${queryPattern} OR articles.abstract ILIKE ${queryPattern}) 
    AND articles.is_published = true 
    ORDER BY articles.published_at DESC 
    LIMIT 10
  `;
  return enrichArticles(result);
}

export async function getAllArticlesAdmin(): Promise<ArticleWithMeta[]> {
  const result = await sql`
    SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
    FROM articles 
    LEFT JOIN analysts ON articles.analyst_id = analysts.id 
    ORDER BY articles.created_at DESC
  `;
  return enrichArticles(result);
}

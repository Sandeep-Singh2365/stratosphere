import { getDb } from '@/lib/db';
import { ArticleWithMeta, Region, Topic } from '@/types';
import { unstable_cache } from 'next/cache';

export type LanguageCode = string

type ArticleRow = Omit<ArticleWithMeta, 'regions' | 'topics'> & {
  // present in SQL SELECTs in this file
  analyst_name?: string | null
  analyst_slug?: string | null
  analyst_photo?: string | null
}

type RegionRow = {
  article_id: string
  id: string
  name: string
  slug: string
  color: string
}

type TopicRow = {
  article_id: string
  id: string
  name: string
  slug: string
  color: string
}

function hasRows(result: unknown): result is { rows: unknown[] } {
  return (
    typeof result === 'object' &&
    result !== null &&
    'rows' in result &&
    Array.isArray((result as Record<string, unknown>).rows)
  )
}

function normalizeRows<T>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[]
  if (hasRows(result)) return (result.rows as T[]) ?? []
  return []
}

async function enrichArticles(articles: ArticleRow[]): Promise<ArticleWithMeta[]> {
  if (articles.length === 0) return []
  
  const ids = articles.map(a => a.id)
  
  // Batch fetch all regions for all articles in 2 queries instead of 2N
  const sql = getDb();
  const allRegionRowsResult = await sql`
    SELECT ar.article_id, r.id, r.name, r.slug, r.color
    FROM article_regions ar
    JOIN regions r ON r.id = ar.region_id
    WHERE ar.article_id = ANY(${ids}::uuid[])
  `
  const allRegionRows = normalizeRows<RegionRow>(allRegionRowsResult)
  
  const allTopicRowsResult = await sql`
    SELECT at.article_id, t.id, t.name, t.slug, t.color
    FROM article_topics at
    JOIN topics t ON t.id = at.topic_id
    WHERE at.article_id = ANY(${ids}::uuid[])
  `
  const allTopicRows = normalizeRows<TopicRow>(allTopicRowsResult)

  const regionsByArticle = new Map<string, Region[]>()
  const topicsByArticle = new Map<string, Topic[]>()

  allRegionRows.forEach((row) => {
    const existing = regionsByArticle.get(row.article_id) ?? []
    existing.push({ id: row.id, name: row.name, slug: row.slug, color: row.color })
    regionsByArticle.set(row.article_id, existing)
  })

  allTopicRows.forEach((row) => {
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
    const sql = getDb();
    const result = await sql`
      SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
      FROM articles 
      LEFT JOIN analysts ON articles.analyst_id = analysts.id 
      WHERE articles.section = ${section} AND articles.is_featured = true 
      AND articles.is_published = true 
      ORDER BY articles.published_at DESC LIMIT 3
    `;
    const rows = normalizeRows<ArticleRow>(result)
    return enrichArticles(rows);
  },
  ['featured-articles'],
  { revalidate: 300, tags: ['articles'] } // 5 min cache
)

export const getArticlesBySection = unstable_cache(
  async (section: 'wire' | 'institute', limit = 20) => {
    const sql = getDb();
    const result = await sql`
      SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
      FROM articles 
      LEFT JOIN analysts ON articles.analyst_id = analysts.id 
      WHERE articles.section = ${section} AND articles.is_published = true 
      ORDER BY articles.published_at DESC LIMIT ${limit}
    `;
    const rows = normalizeRows<ArticleRow>(result)
    return enrichArticles(rows);
  },
  ['articles-by-section'],
  { revalidate: 300, tags: ['articles'] }
)

export async function getArticleBySlug(slug: string): Promise<ArticleWithMeta | null> {
  const sql = getDb();
  const result = await sql`
    SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
    FROM articles 
    LEFT JOIN analysts ON articles.analyst_id = analysts.id 
    WHERE articles.slug = ${slug} AND articles.is_published = true
  `;
  const rows = normalizeRows<ArticleRow>(result)
  if (rows.length === 0) return null;
  const enriched = await enrichArticles(rows);
  return enriched[0];
}

/**
 * Language-aware fetch:
 * - If `lang` matches the fetched article's `language`, return it.
 * - Otherwise, attempt to return a published translation row where
 *   (original_article_id = baseId AND language = lang).
 * - Falls back to the originally fetched article when no translation exists.
 *
 * NOTE: This is designed to work even if translation slugs differ, because the
 * URL can stay on the original slug while content swaps via `lang`.
 */
export async function getArticleBySlugLocalized(
  slug: string,
  lang: LanguageCode
): Promise<ArticleWithMeta | null> {
  const base = await getArticleBySlug(slug)
  if (!base) return null

  // No language requested, or already correct language.
  if (!lang || base.language === lang) return base

  const sql = getDb()
  const baseId = base.original_article_id ?? base.id

  const result = await sql`
    SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo
    FROM articles
    LEFT JOIN analysts ON articles.analyst_id = analysts.id
    WHERE articles.original_article_id = ${baseId}
      AND articles.language = ${lang}
      AND articles.is_published = true
    LIMIT 1
  `
  const rows = normalizeRows<ArticleRow>(result)
  if (rows.length === 0) return base
  const enriched = await enrichArticles(rows)
  return enriched[0] ?? base
}

export async function getArticlesByRegion(regionSlug: string, section?: string): Promise<ArticleWithMeta[]> {
  const sql = getDb();
  const result = section
    ? await sql`
      SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
      FROM articles 
      LEFT JOIN analysts ON articles.analyst_id = analysts.id 
      JOIN article_regions ar ON ar.article_id = articles.id 
      JOIN regions r ON r.id = ar.region_id 
      WHERE r.slug = ${regionSlug} AND articles.is_published = true 
      AND articles.section = ${section}
      ORDER BY articles.published_at DESC
    `
    : await sql`
      SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
      FROM articles 
      LEFT JOIN analysts ON articles.analyst_id = analysts.id 
      JOIN article_regions ar ON ar.article_id = articles.id 
      JOIN regions r ON r.id = ar.region_id 
      WHERE r.slug = ${regionSlug} AND articles.is_published = true
      ORDER BY articles.published_at DESC
    `
  const rows = normalizeRows<ArticleRow>(result)
  return enrichArticles(rows);
}

export async function getArticlesByTopic(topicSlug: string, section?: string): Promise<ArticleWithMeta[]> {
  const sql = getDb();
  const result = section
    ? await sql`
      SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
      FROM articles 
      LEFT JOIN analysts ON articles.analyst_id = analysts.id 
      JOIN article_topics at ON at.article_id = articles.id 
      JOIN topics t ON t.id = at.topic_id 
      WHERE t.slug = ${topicSlug} AND articles.is_published = true 
      AND articles.section = ${section}
      ORDER BY articles.published_at DESC
    `
    : await sql`
      SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
      FROM articles 
      LEFT JOIN analysts ON articles.analyst_id = analysts.id 
      JOIN article_topics at ON at.article_id = articles.id 
      JOIN topics t ON t.id = at.topic_id 
      WHERE t.slug = ${topicSlug} AND articles.is_published = true
      ORDER BY articles.published_at DESC
    `
  const rows = normalizeRows<ArticleRow>(result)
  return enrichArticles(rows);
}

export async function getArticlesByAnalyst(analystSlug: string): Promise<ArticleWithMeta[]> {
  const sql = getDb();
  const result = await sql`
    SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
    FROM articles 
    JOIN analysts ON articles.analyst_id = analysts.id 
    WHERE analysts.slug = ${analystSlug} AND articles.is_published = true
    ORDER BY articles.published_at DESC
  `;
  const rows = normalizeRows<ArticleRow>(result)
  return enrichArticles(rows);
}

export async function searchArticles(query: string): Promise<ArticleWithMeta[]> {
  const queryPattern = `%${query}%`;
  const sql = getDb();
  const result = await sql`
    SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
    FROM articles 
    LEFT JOIN analysts ON articles.analyst_id = analysts.id 
    WHERE (articles.title ILIKE ${queryPattern} OR articles.abstract ILIKE ${queryPattern}) 
    AND articles.is_published = true 
    ORDER BY articles.published_at DESC 
    LIMIT 10
  `;
  const rows = normalizeRows<ArticleRow>(result)
  return enrichArticles(rows);
}

export async function getArticlesByFramework(
  framework: 'what_if' | 'how' | 'why',
  options?: { section?: 'wire' | 'institute'; language?: LanguageCode; limit?: number }
): Promise<ArticleWithMeta[]> {
  const sql = getDb()
  const section = options?.section ?? null
  const language = options?.language ?? null
  const limit = options?.limit ?? 20

  const result = await sql`
    SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo
    FROM articles
    LEFT JOIN analysts ON articles.analyst_id = analysts.id
    WHERE articles.framework = ${framework}
      AND articles.is_published = true
      AND (${section}::text IS NULL OR articles.section = ${section})
      AND (${language}::text IS NULL OR articles.language = ${language})
    ORDER BY articles.published_at DESC
    LIMIT ${limit}
  `
  const rows = normalizeRows<ArticleRow>(result)
  return enrichArticles(rows)
}

export async function getAllArticlesAdmin(): Promise<ArticleWithMeta[]> {
  const sql = getDb();
  const result = await sql`
    SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
    FROM articles 
    LEFT JOIN analysts ON articles.analyst_id = analysts.id 
    ORDER BY articles.created_at DESC
  `;
  const rows = normalizeRows<ArticleRow>(result)
  return enrichArticles(rows);
}

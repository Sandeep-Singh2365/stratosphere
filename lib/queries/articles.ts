/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db';
import { ArticleWithMeta, Region, Topic } from '@/types';

// Private helper functions for fetching regions and topics per article
async function getArticleRegions(articleId: string): Promise<Region[]> {
  const result = await sql`
    SELECT regions.* FROM regions 
    JOIN article_regions ON article_regions.region_id = regions.id 
    WHERE article_regions.article_id = ${articleId}
  `;
  return result as Region[];
}

async function getArticleTopics(articleId: string): Promise<Topic[]> {
  const result = await sql`
    SELECT topics.* FROM topics 
    JOIN article_topics ON article_topics.topic_id = topics.id 
    WHERE article_topics.article_id = ${articleId}
  `;
  return result as Topic[];
}

async function enrichArticles(articles: any[]): Promise<ArticleWithMeta[]> {
  const enriched: ArticleWithMeta[] = [];
  for (const article of articles) {
    const regions = await getArticleRegions(article.id);
    const topics = await getArticleTopics(article.id);
    enriched.push({
      ...article,
      regions,
      topics,
    });
  }
  return enriched;
}

export async function getFeaturedArticles(section: 'wire' | 'institute'): Promise<ArticleWithMeta[]> {
  const result = await sql`
    SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
    FROM articles 
    LEFT JOIN analysts ON articles.analyst_id = analysts.id 
    WHERE articles.section = ${section} AND articles.is_featured = true 
    AND articles.is_published = true 
    ORDER BY articles.published_at DESC LIMIT 3
  `;
  return enrichArticles(result);
}

export async function getArticlesBySection(section: 'wire' | 'institute', limit = 20): Promise<ArticleWithMeta[]> {
  const result = await sql`
    SELECT articles.*, analysts.name as analyst_name, analysts.slug as analyst_slug, analysts.photo_url as analyst_photo 
    FROM articles 
    LEFT JOIN analysts ON articles.analyst_id = analysts.id 
    WHERE articles.section = ${section} AND articles.is_published = true 
    ORDER BY articles.published_at DESC LIMIT ${limit}
  `;
  return enrichArticles(result);
}

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

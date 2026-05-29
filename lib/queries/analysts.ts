import { sql } from '@/lib/db';
import { Analyst } from '@/types';

export async function getAllAnalysts(): Promise<Analyst[]> {
  const result = await sql`
    SELECT analysts.*, COUNT(articles.id)::integer as article_count 
    FROM analysts 
    LEFT JOIN articles ON articles.analyst_id = analysts.id AND articles.is_published = true 
    GROUP BY analysts.id 
    ORDER BY analysts.name
  `;
  return result as Analyst[];
}

export async function getAnalystBySlug(slug: string): Promise<Analyst | null> {
  const result = await sql`
    SELECT analysts.*, COUNT(articles.id)::integer as article_count 
    FROM analysts 
    LEFT JOIN articles ON articles.analyst_id = analysts.id 
    WHERE analysts.slug = ${slug} 
    GROUP BY analysts.id
  `;
  if (result.length === 0) return null;
  return result[0] as Analyst;
}

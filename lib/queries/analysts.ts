import { getDb } from '@/lib/db';
import { Analyst } from '@/types';

export async function getAllAnalysts(): Promise<Analyst[]> {
  const sql = getDb();
  const result = await sql`
    SELECT analysts.*, COUNT(articles.id)::integer as article_count 
    FROM analysts 
    LEFT JOIN articles ON articles.analyst_id = analysts.id AND articles.is_published = true 
    GROUP BY analysts.id 
    ORDER BY analysts.name
  `;
  const rows = Array.isArray(result) ? result : 'rows' in (result as any) ? (result as any).rows : [];
  return rows as Analyst[];
}

export async function getAnalystBySlug(slug: string): Promise<Analyst | null> {
  const sql = getDb();
  const result = await sql`
    SELECT analysts.*, COUNT(articles.id)::integer as article_count 
    FROM analysts 
    LEFT JOIN articles ON articles.analyst_id = analysts.id 
    WHERE analysts.slug = ${slug} 
    GROUP BY analysts.id
  `;
  const rows = Array.isArray(result) ? result : 'rows' in (result as any) ? (result as any).rows : [];
  if (rows.length === 0) return null;
  return rows[0] as Analyst;
}

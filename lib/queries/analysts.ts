import { getDb } from '@/lib/db';
import { Analyst } from '@/types';
import { normalizeRows } from '@/lib/queries/normalize'

export type AnalystSection = 'wire' | 'institute'

export async function getAllAnalysts(section?: AnalystSection): Promise<Analyst[]> {
  const sql = getDb();
  const sectionValue: AnalystSection | null = section ?? null
  const result = await sql`
    SELECT
      analysts.*,
      COUNT(articles.id) FILTER (
        WHERE
          articles.is_published = true
          AND (${sectionValue}::text IS NULL OR articles.section = ${sectionValue})
      )::integer as article_count
    FROM analysts 
    LEFT JOIN articles ON articles.analyst_id = analysts.id
    GROUP BY analysts.id 
    ORDER BY analysts.name
  `;
  return normalizeRows<Analyst>(result)
}

export async function getAnalystBySlug(
  slug: string,
  section?: AnalystSection
): Promise<Analyst | null> {
  const sql = getDb();
  const sectionValue: AnalystSection | null = section ?? null
  const result = await sql`
    SELECT
      analysts.*,
      COUNT(articles.id) FILTER (
        WHERE
          articles.is_published = true
          AND (${sectionValue}::text IS NULL OR articles.section = ${sectionValue})
      )::integer as article_count
    FROM analysts 
    LEFT JOIN articles ON articles.analyst_id = analysts.id
    WHERE analysts.slug = ${slug} 
    GROUP BY analysts.id
  `;
  const rows = normalizeRows<Analyst>(result)
  if (rows.length === 0) return null;
  return rows[0] ?? null
}

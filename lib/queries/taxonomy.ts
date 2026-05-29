import { sql } from '@/lib/db';
import { Region, Topic } from '@/types';

export async function getAllRegions(): Promise<Region[]> {
  const result = await sql`
    SELECT regions.*, COUNT(article_regions.article_id)::integer as article_count
    FROM regions 
    LEFT JOIN article_regions ON article_regions.region_id = regions.id
    GROUP BY regions.id 
    ORDER BY regions.name
  `;
  return result as Region[];
}

export async function getAllTopics(): Promise<Topic[]> {
  const result = await sql`
    SELECT topics.*, COUNT(article_topics.article_id)::integer as article_count
    FROM topics 
    LEFT JOIN article_topics ON article_topics.topic_id = topics.id
    GROUP BY topics.id 
    ORDER BY topics.name
  `;
  return result as Topic[];
}

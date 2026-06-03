import { getDb } from '@/lib/db';
import { Article, NewsletterSubscriber, User } from '@/types';
import { normalizeRows } from '@/lib/queries/normalize'

export type ArticleInsert = {
  title: string;
  slug: string;
  abstract?: string;
  content?: string;
  cover_image?: string;
  section: 'wire' | 'institute';
  content_type?: Article['content_type'];
  analyst_id?: string;
  is_published?: boolean;
  is_featured?: boolean;
  published_at?: string;
  read_time?: number;
  pdf_url?: string;
  framework?: NonNullable<Article['framework']> | null;
  language?: Article['language'] | null;
  original_article_id?: string | null;
  region_ids?: string[];
  topic_ids?: string[];
};

export async function createArticle(data: ArticleInsert): Promise<Article> {
  const sql = getDb();
  const result = await sql`
    INSERT INTO articles (
      title, slug, abstract, content, cover_image, section, content_type,
      analyst_id, is_published, is_featured, published_at, read_time, pdf_url,
      framework, language, original_article_id
    ) VALUES (
      ${data.title},
      ${data.slug},
      ${data.abstract ?? null},
      ${data.content ?? null},
      ${data.cover_image ?? null},
      ${data.section},
      ${data.content_type ?? null},
      ${data.analyst_id ?? null},
      ${data.is_published ?? false},
      ${data.is_featured ?? false},
      ${data.published_at ? new Date(data.published_at) : null},
      ${data.read_time ?? null},
      ${data.pdf_url ?? null},
      ${data.framework ?? null},
      ${data.language ?? 'en'},
      ${data.original_article_id ?? null}
    ) RETURNING *
  `;

  const rows = normalizeRows<Article>(result)
  const article = rows[0]
  if (!article) {
    throw new Error('Failed to create article (no row returned)')
  }

  if (data.region_ids && data.region_ids.length > 0) {
    for (const regionId of data.region_ids) {
      await sql`
        INSERT INTO article_regions (article_id, region_id)
        VALUES (${article.id}, ${regionId})
      `;
    }
  }

  if (data.topic_ids && data.topic_ids.length > 0) {
    for (const topicId of data.topic_ids) {
      await sql`
        INSERT INTO article_topics (article_id, topic_id)
        VALUES (${article.id}, ${topicId})
      `;
    }
  }

  return article;
}

export async function updateArticle(id: string, data: Partial<ArticleInsert>): Promise<Article> {
  const sql = getDb();
  const result = await sql`
    UPDATE articles SET
      title = CASE WHEN ${data.title === undefined} THEN title ELSE ${data.title ?? null} END,
      slug = CASE WHEN ${data.slug === undefined} THEN slug ELSE ${data.slug ?? null} END,
      abstract = CASE WHEN ${data.abstract === undefined} THEN abstract ELSE ${data.abstract ?? null} END,
      content = CASE WHEN ${data.content === undefined} THEN content ELSE ${data.content ?? null} END,
      cover_image = CASE WHEN ${data.cover_image === undefined} THEN cover_image ELSE ${data.cover_image ?? null} END,
      section = CASE WHEN ${data.section === undefined} THEN section ELSE ${data.section ?? null} END,
      content_type = CASE WHEN ${data.content_type === undefined} THEN content_type ELSE ${data.content_type ?? null} END,
      analyst_id = CASE WHEN ${data.analyst_id === undefined} THEN analyst_id ELSE ${data.analyst_id ?? null} END,
      is_published = CASE WHEN ${data.is_published === undefined} THEN is_published ELSE ${data.is_published ?? null} END,
      is_featured = CASE WHEN ${data.is_featured === undefined} THEN is_featured ELSE ${data.is_featured ?? null} END,
      published_at = CASE WHEN ${data.published_at === undefined} THEN published_at ELSE ${data.published_at ? new Date(data.published_at) : null} END,
      read_time = CASE WHEN ${data.read_time === undefined} THEN read_time ELSE ${data.read_time ?? null} END,
      pdf_url = CASE WHEN ${data.pdf_url === undefined} THEN pdf_url ELSE ${data.pdf_url ?? null} END,
      framework = CASE WHEN ${data.framework === undefined} THEN framework ELSE ${data.framework ?? null} END,
      language = CASE WHEN ${data.language === undefined} THEN language ELSE ${data.language ?? null} END,
      original_article_id = CASE WHEN ${data.original_article_id === undefined} THEN original_article_id ELSE ${data.original_article_id ?? null} END,
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  const rows = normalizeRows<Article>(result)
  if (rows.length === 0) {
    throw new Error(`Article with id ${id} not found`);
  }

  const article = rows[0]!

  if (data.region_ids !== undefined) {
    await sql`DELETE FROM article_regions WHERE article_id = ${id}`;
    if (data.region_ids.length > 0) {
      for (const regionId of data.region_ids) {
        await sql`
          INSERT INTO article_regions (article_id, region_id)
          VALUES (${id}, ${regionId})
        `;
      }
    }
  }

  if (data.topic_ids !== undefined) {
    await sql`DELETE FROM article_topics WHERE article_id = ${id}`;
    if (data.topic_ids.length > 0) {
      for (const topicId of data.topic_ids) {
        await sql`
          INSERT INTO article_topics (article_id, topic_id)
          VALUES (${id}, ${topicId})
        `;
      }
    }
  }

  return article;
}

export async function deleteArticle(id: string): Promise<void> {
  const sql = getDb();
  await sql`DELETE FROM articles WHERE id = ${id}`;
}

export async function publishArticle(id: string): Promise<void> {
  const sql = getDb();
  await sql`
    UPDATE articles 
    SET is_published = true, published_at = NOW(), updated_at = NOW() 
    WHERE id = ${id}
  `;
}

export async function toggleFeatured(id: string, value: boolean): Promise<void> {
  const sql = getDb();
  await sql`
    UPDATE articles 
    SET is_featured = ${value}, updated_at = NOW() 
    WHERE id = ${id}
  `;
}

export async function addNewsletterSubscriber(email: string): Promise<{ success: boolean; alreadyExists: boolean }> {
  try {
    const sql = getDb();
    const existingResult = await sql`
      SELECT * FROM newsletter_subscribers WHERE email = ${email}
    `;
    const existing = normalizeRows<NewsletterSubscriber>(existingResult)
    const alreadyExists = existing.length > 0;

    await sql`
      INSERT INTO newsletter_subscribers (email) 
      VALUES (${email})
      ON CONFLICT (email) DO UPDATE SET is_active = true
    `;
    return { success: true, alreadyExists };
  } catch (error: unknown) {
    const code = typeof error === 'object' && error !== null && 'code' in error
      ? String((error as Record<string, unknown>).code ?? '')
      : ''
    const message = typeof error === 'object' && error !== null && 'message' in error
      ? String((error as Record<string, unknown>).message ?? '')
      : ''

    if (code === '23505' || message.includes('unique') || message.includes('duplicate')) {
      return { success: true, alreadyExists: true };
    }
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM users WHERE email = ${email} LIMIT 1
  `;
  const rows = normalizeRows<User & { password_hash: string }>(result)
  if (rows.length === 0) return null;
  return rows[0] ?? null
}

export async function getUserById(id: string): Promise<(User & { password_hash: string }) | null> {
  const sql = getDb()
  const result = await sql`
    SELECT * FROM users WHERE id = ${id} LIMIT 1
  `
  const rows = normalizeRows<User & { password_hash: string }>(result)
  if (rows.length === 0) return null
  return rows[0] ?? null
}

export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC
  `;
  return normalizeRows<NewsletterSubscriber>(result)
}

export async function updateAdminCredentials(
  userId: string,
  data: { email?: string; password_hash?: string }
): Promise<User> {
  const sql = getDb()
  const result = await sql`
    UPDATE users SET
      email = CASE WHEN ${data.email === undefined} THEN email ELSE ${data.email} END,
      password_hash = CASE WHEN ${data.password_hash === undefined} THEN password_hash ELSE ${data.password_hash} END
    WHERE id = ${userId}
    RETURNING id, email, role, created_at
  `
  const rows = normalizeRows<User>(result)
  const updated = rows[0]
  if (!updated) throw new Error('User not found')
  return updated
}

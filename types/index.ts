export interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Analyst {
  id: string;
  name: string;
  slug: string;
  bio: string;
  photo_url: string;
  title: string;
  twitter?: string;
  linkedin?: string;
  article_count?: number;
  created_at: string;
}

export interface Region {
  id: string;
  name: string;
  slug: string;
  color: string;
  article_count?: number;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  color: string;
  article_count?: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  content: string;
  cover_image: string;
  section: 'wire' | 'institute';
  content_type: 'analysis' | 'brief' | 'paper' | 'report' | 'interview';
  analyst_id: string;
  is_published: boolean;
  is_featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  read_time: number;
  pdf_url?: string;
  framework?: 'what_if' | 'how' | 'why';
  language: string;
  original_article_id?: string | null;
}

export interface ArticleWithMeta extends Article {
  analyst_name?: string;
  analyst_slug?: string;
  analyst_photo?: string;
  regions: Region[];
  topics: Topic[];
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analysts table
CREATE TABLE IF NOT EXISTS analysts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  photo_url TEXT,
  title TEXT,
  twitter TEXT,
  linkedin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Regions table
CREATE TABLE IF NOT EXISTS regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  abstract TEXT,
  content TEXT,
  cover_image TEXT,
  section TEXT NOT NULL CHECK (section IN ('wire', 'institute')),
  content_type TEXT CHECK (content_type IN ('analysis','brief','paper','report','interview')),
  analyst_id UUID REFERENCES analysts(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  read_time INTEGER,
  pdf_url TEXT,
  -- Content matrix: What-if / How / Why
  framework TEXT CHECK (framework IN ('what_if', 'how', 'why')),
  -- Language + translation model
  language TEXT NOT NULL DEFAULT 'en',
  -- If set, this row is a translation of another article (the "original").
  original_article_id UUID REFERENCES articles(id) ON DELETE SET NULL
);

-- Backfill / forward-migration helpers for existing databases
ALTER TABLE articles ADD COLUMN IF NOT EXISTS framework TEXT CHECK (framework IN ('what_if', 'how', 'why'));
ALTER TABLE articles ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS original_article_id UUID REFERENCES articles(id) ON DELETE SET NULL;

-- Translation uniqueness: only one translation per (original_article_id, language)
-- (English originals typically have original_article_id NULL and language='en')
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_translation_unique
  ON articles(original_article_id, language)
  WHERE original_article_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_articles_section_language ON articles(section, language);
CREATE INDEX IF NOT EXISTS idx_articles_framework ON articles(framework);
CREATE INDEX IF NOT EXISTS idx_articles_original_article ON articles(original_article_id);

-- Junction: article_regions
CREATE TABLE IF NOT EXISTS article_regions (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, region_id)
);

-- Junction: article_topics
CREATE TABLE IF NOT EXISTS article_topics (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, topic_id)
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

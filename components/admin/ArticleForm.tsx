'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArticleWithMeta, Analyst, Region, Topic } from '@/types'
import { createArticleAction, updateArticleAction } from '@/app/actions/articles'

interface ArticleFormProps {
  article?: ArticleWithMeta
  analysts: Analyst[]
  regions: Region[]
  topics: Topic[]
  allArticles?: ArticleWithMeta[]
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function ArticleForm({ 
  article, analysts, regions, topics, allArticles = []
}: ArticleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [section, setSection] = useState<'wire' | 'institute'>(
    article?.section ?? 'wire'
  )
  const [contentType, setContentType] = useState(
    article?.content_type ?? 'analysis'
  )
  const [abstract, setAbstract] = useState(article?.abstract ?? '')
  const [content, setContent] = useState(article?.content ?? '')
  const [coverImage, setCoverImage] = useState(article?.cover_image ?? '')
  const [pdfUrl, setPdfUrl] = useState(article?.pdf_url ?? '')
  const [framework, setFramework] = useState<
    '' | 'what_if' | 'how' | 'why'
  >(article?.framework ?? '')
  const [language, setLanguage] = useState(article?.language ?? 'en')
  const [originalArticleId, setOriginalArticleId] = useState(
    article?.original_article_id ?? ''
  )
  const [analystId, setAnalystId] = useState(article?.analyst_id ?? '')
  const [readTime, setReadTime] = useState(article?.read_time ?? 5)
  const [isFeatured, setIsFeatured] = useState(article?.is_featured ?? false)
  const [isPublished, setIsPublished] = useState(article?.is_published ?? false)
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    article?.regions?.map(r => r.id) ?? []
  )
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    article?.topics?.map(t => t.id) ?? []
  )

  const handleTitleBlur = () => {
    if (!article && title && !slug) {
      setSlug(slugify(title))
    }
  }

  const toggleRegion = (id: string) => {
    setSelectedRegions(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  const toggleTopic = (id: string) => {
    setSelectedTopics(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const data = {
        title, slug, section, content_type: contentType,
        abstract, content, cover_image: coverImage,
        pdf_url: pdfUrl || undefined,
        framework: framework || null,
        language,
        original_article_id: originalArticleId || null,
        analyst_id: analystId || undefined,
        read_time: readTime, is_featured: isFeatured,
        is_published: isPublished,
        region_ids: selectedRegions,
        topic_ids: selectedTopics,
      }
      if (article) {
        await updateArticleAction(article.id, data)
        setSuccess('Article updated successfully.')
      } else {
        await createArticleAction(data)
        setSuccess('Article created successfully.')
        router.push('/admin/articles')
      }
    } catch (e: unknown) {
      const msg =
        typeof e === 'object' && e !== null && 'message' in e
          ? String((e as Record<string, unknown>).message ?? 'An error occurred.')
          : 'An error occurred.'
      setError(msg)
    }
    setLoading(false)
  }

  const fieldClass = "bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
  const labelClass = "text-slate-300 text-sm font-medium block mb-1"
  const selectClass =
    "w-full bg-slate-900 border border-slate-600 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Title */}
      <div>
        <label className={labelClass}>Title</label>
        <Input value={title} onChange={e => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          placeholder="Article title" className={fieldClass} />
      </div>

      {/* Slug */}
      <div>
        <label className={labelClass}>Slug</label>
        <Input value={slug} onChange={e => setSlug(e.target.value)}
          placeholder="article-slug" className={fieldClass} />
      </div>

      {/* Section + Content Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Section</label>
          <select value={section}
            onChange={e => setSection(e.target.value as 'wire' | 'institute')}
            className={selectClass}>
            <option value="wire">Wire</option>
            <option value="institute">Institute</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Content Type</label>
          <select value={contentType}
            onChange={e => setContentType(e.target.value as 'analysis' | 'brief' | 'paper' | 'report' | 'interview')}
            className={selectClass}>
            <option value="analysis">Analysis</option>
            <option value="brief">Brief</option>
            <option value="paper">Paper</option>
            <option value="report">Report</option>
            <option value="interview">Interview</option>
          </select>
        </div>
      </div>

      {/* Framework + Language */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Framework</label>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value as '' | 'what_if' | 'how' | 'why')}
            className={selectClass}
          >
            <option value="">— None —</option>
            <option value="what_if">What-if</option>
            <option value="how">How</option>
            <option value="why">Why</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={selectClass}
          >
            <option value="en">English (en)</option>
            <option value="es">Spanish (es)</option>
            <option value="fr">French (fr)</option>
            <option value="de">German (de)</option>
            <option value="ar">Arabic (ar)</option>
            <option value="hi">Hindi (hi)</option>
            <option value="zh">Chinese (zh)</option>
            <option value="ru">Russian (ru)</option>
            <option value="pt">Portuguese (pt)</option>
          </select>
        </div>
      </div>

      {/* Translation mapping */}
      <div>
        <label className={labelClass}>Original Article (for translations)</label>
        <select
          value={originalArticleId ?? ''}
          onChange={(e) => setOriginalArticleId(e.target.value)}
          className={selectClass}
        >
          <option value="">— None —</option>
          {allArticles
            .filter((a) => a.id !== article?.id)
            .map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}{a.language ? ` (${a.language})` : ''}
              </option>
            ))}
        </select>
        <p className="text-slate-500 text-xs mt-1">
          Set this when this article is a translation of an existing one.
        </p>
      </div>

      {/* Abstract */}
      <div>
        <label className={labelClass}>Abstract</label>
        <textarea value={abstract}
          onChange={e => setAbstract(e.target.value)}
          rows={3}
          placeholder="Short summary of the article"
          className="w-full bg-slate-900 border border-slate-600 text-white 
            placeholder:text-slate-500 rounded-md px-3 py-2 text-sm 
            focus:outline-none focus:border-blue-500 resize-y" />
      </div>

      {/* Content */}
      <div>
        <label className={labelClass}>Content (Markdown)</label>
        <textarea value={content}
          onChange={e => setContent(e.target.value)}
          rows={16}
          placeholder="Article body in markdown..."
          className="w-full bg-slate-900 border border-slate-600 text-white 
            placeholder:text-slate-500 rounded-md px-3 py-2 text-sm 
            focus:outline-none focus:border-blue-500 resize-y font-mono" />
      </div>

      {/* Cover Image URL */}
      <div>
        <label className={labelClass}>Cover Image URL</label>
        <Input value={coverImage}
          onChange={e => setCoverImage(e.target.value)}
          placeholder="https://..." className={fieldClass} />
      </div>

      {/* PDF URL (institute only) */}
      {section === 'institute' && (
        <div>
          <label className={labelClass}>PDF URL</label>
          <Input value={pdfUrl}
            onChange={e => setPdfUrl(e.target.value)}
            placeholder="/papers/filename.pdf" className={fieldClass} />
        </div>
      )}

      {/* Analyst */}
      <div>
        <label className={labelClass}>Author / Analyst</label>
        <select value={analystId}
          onChange={e => setAnalystId(e.target.value)}
          className={selectClass}>
          <option value="">— Select analyst —</option>
          {analysts.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Read time */}
      <div>
        <label className={labelClass}>Read Time (minutes)</label>
        <Input type="number" value={readTime}
          onChange={e => setReadTime(Number(e.target.value))}
          min={1} max={120} className={fieldClass} />
      </div>

      {/* Regions */}
      <div>
        <label className={labelClass}>Regions</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {regions.map(r => (
            <button key={r.id} type="button"
              onClick={() => toggleRegion(r.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium 
                border transition-colors ${
                selectedRegions.includes(r.id)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-800 text-slate-300 border-slate-600 hover:border-blue-500'
              }`}>
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div>
        <label className={labelClass}>Topics</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {topics.map(t => (
            <button key={t.id} type="button"
              onClick={() => toggleTopic(t.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium 
                border transition-colors ${
                selectedTopics.includes(t.id)
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-slate-800 text-slate-300 border-slate-600 hover:border-purple-500'
              }`}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isFeatured}
            onChange={e => setIsFeatured(e.target.checked)}
            className="w-4 h-4 rounded" />
          <span className="text-slate-300 text-sm">Featured</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isPublished}
            onChange={e => setIsPublished(e.target.checked)}
            className="w-4 h-4 rounded" />
          <span className="text-slate-300 text-sm">Published</span>
        </label>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">{success}</p>}

      <Button onClick={handleSubmit} disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8">
        {loading ? 'Saving...' : article ? 'Update Article' : 'Create Article'}
      </Button>
    </div>
  )
}

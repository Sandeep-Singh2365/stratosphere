'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createAnalystAction } from '@/app/actions/analysts'

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function AnalystForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [twitter, setTwitter] = useState('')
  const [linkedin, setLinkedin] = useState('')

  const handleNameBlur = () => {
    if (name && !slug) setSlug(slugify(name))
  }

  const handleSubmit = async () => {
    if (!name || !slug || !title) {
      setError('Name, slug, and title are required.')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await createAnalystAction({
        name, slug, title, bio,
        photo_url: photoUrl || undefined,
        twitter: twitter || undefined,
        linkedin: linkedin || undefined,
      })
      setSuccess('Analyst created successfully.')
      router.push('/admin/analysts')
      router.refresh()
    } catch (e: any) {
      setError(e.message ?? 'An error occurred.')
    }
    setLoading(false)
  }

  const fieldClass = "bg-slate-900 border-slate-600 text-white \
    placeholder:text-slate-500 focus:border-blue-500"
  const labelClass = "text-slate-300 text-sm font-medium block mb-1"

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <label className={labelClass}>Full Name *</label>
        <Input value={name} onChange={e => setName(e.target.value)}
          onBlur={handleNameBlur}
          placeholder="Dr. Jane Smith" className={fieldClass} />
      </div>
      <div>
        <label className={labelClass}>Slug *</label>
        <Input value={slug} onChange={e => setSlug(e.target.value)}
          placeholder="jane-smith" className={fieldClass} />
        <p className="text-slate-500 text-xs mt-1">
          URL-friendly identifier, auto-generated from name
        </p>
      </div>
      <div>
        <label className={labelClass}>Title / Designation *</label>
        <Input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Senior Fellow, Indo-Pacific Security"
          className={fieldClass} />
      </div>
      <div>
        <label className={labelClass}>Biography</label>
        <textarea value={bio}
          onChange={e => setBio(e.target.value)}
          rows={4}
          placeholder="Brief academic or professional biography..."
          className="w-full bg-slate-900 border border-slate-600 text-white 
            placeholder:text-slate-500 rounded-md px-3 py-2 text-sm 
            focus:outline-none focus:border-blue-500 resize-y" />
      </div>
      <div>
        <label className={labelClass}>Photo URL</label>
        <Input value={photoUrl} onChange={e => setPhotoUrl(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className={fieldClass} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Twitter / X Handle</label>
          <Input value={twitter} onChange={e => setTwitter(e.target.value)}
            placeholder="@username" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>LinkedIn URL</label>
          <Input value={linkedin} onChange={e => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/in/..."
            className={fieldClass} />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">{success}</p>}

      <Button onClick={handleSubmit} disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8">
        {loading ? 'Creating...' : 'Create Analyst'}
      </Button>
    </div>
  )
}

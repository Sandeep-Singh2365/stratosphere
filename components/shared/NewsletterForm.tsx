'use client'
import { useState } from 'react'

interface NewsletterFormProps {
  theme: 'wire' | 'institute'
}

export default function NewsletterForm({ theme }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.alreadyExists 
          ? 'You are already subscribed!' 
          : 'Subscribed successfully! Welcome.')
        setEmail('')
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
          setEmail('')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Subscription failed. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  const isWire = theme === 'wire'

  return (
    <div>
      <div className="flex gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
          placeholder="your@email.com"
          disabled={status === 'loading'}
          className={`flex-1 border rounded-lg px-4 py-2 text-sm 
            focus:outline-none ${isWire
              ? 'bg-wire-bg border-wire-border text-wire-text focus:border-wire-accent placeholder:text-wire-muted'
              : 'bg-white border-institute-border text-institute-text focus:border-institute-accent placeholder:text-institute-muted'
            }`}
        />
        <button
          onClick={handleSubscribe}
          disabled={status === 'loading'}
          className={`px-6 py-2 rounded-lg text-sm font-medium 
            transition-colors text-white disabled:opacity-50 ${isWire
              ? 'bg-wire-accent hover:bg-blue-600'
              : 'bg-institute-accent hover:bg-amber-900'
            }`}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {message && (
        <p className={`text-xs mt-3 text-center ${
          status === 'success' ? 'text-green-400' : 'text-red-400'
        }`}>
          {message}
        </p>
      )}
    </div>
  )
}

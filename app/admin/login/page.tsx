'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center 
      justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-widest uppercase 
            text-white">
            Stratosphere
          </h1>
          <p className="text-slate-400 text-sm mt-1">Admin Portal</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm font-medium 
                block mb-1">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@stratosphere.com"
                className="bg-slate-900 border-slate-600 text-white 
                  placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium 
                block mb-1">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="bg-slate-900 border-slate-600 text-white 
                  placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

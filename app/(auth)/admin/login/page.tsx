'use client'
import { Suspense, useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import type { SignInResponse } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useSession()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If already authenticated, don't let the user sit on /admin/login.
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin')
    }
  }, [status, router])

  useEffect(() => {
    const err = searchParams.get('error')
    if (err === 'unauthorized') {
      setError('You are not authorized to access the admin area')
    }
  }, [searchParams])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      // NextAuth v5 supports redirectTo; harmless on older versions.
      redirectTo: '/admin',
    } as any) as SignInResponse | undefined

    setLoading(false)
    if (result?.error) {
      setError('Invalid email or password')
      return
    }

    router.push('/admin')
    router.refresh()
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <LoginInner />
    </Suspense>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { searchArticles } from '@/lib/queries'
import { rateLimit } from '@/lib/rateLimit'
import { sanitizeString } from '@/lib/sanitize'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const { success } = rateLimit(ip, 20, 60_000)
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  const rawQ = request.nextUrl.searchParams.get('q')
  if (!rawQ || rawQ.trim().length < 3) {
    return NextResponse.json(
      { error: 'Query must be at least 3 characters' },
      { status: 400 }
    )
  }

  const q = sanitizeString(rawQ)
  const results = await searchArticles(q)
  return NextResponse.json({ results, count: results.length })
}

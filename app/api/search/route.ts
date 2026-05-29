import { NextRequest, NextResponse } from 'next/server'
import { searchArticles } from '@/lib/queries'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')
  if (!q || q.trim().length < 3) {
    return NextResponse.json(
      { error: 'Query must be at least 3 characters' },
      { status: 400 }
    )
  }
  const results = await searchArticles(q.trim())
  return NextResponse.json({ results, count: results.length })
}

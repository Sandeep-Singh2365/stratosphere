import { NextRequest, NextResponse } from 'next/server'
import { addNewsletterSubscriber } from '@/lib/queries'
import { z } from 'zod'
import { rateLimit } from '@/lib/rateLimit'
import { sanitizeEmail } from '@/lib/sanitize'

const schema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const { success } = rateLimit(ip, 5, 60_000)
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { email: rawEmail } = schema.parse(body)
    const email = sanitizeEmail(rawEmail)
    const result = await addNewsletterSubscriber(email)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

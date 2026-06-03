import { NextRequest, NextResponse } from 'next/server'
import { addNewsletterSubscriber } from '@/lib/queries'
import { z } from 'zod'
import { rateLimit } from '@/lib/rateLimit'
import { sanitizeEmail } from '@/lib/sanitize'
import { sendNewsletterWelcomeEmail } from '@/lib/resend'

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

    // Send a welcome email only when the user is newly subscribed.
    // If the email already existed, we treat it as idempotent and do not resend.
    let emailSent = false
    if (result.success && !result.alreadyExists) {
      try {
        const out = await sendNewsletterWelcomeEmail({ to: email })
        emailSent = out.sent
      } catch (err) {
        // Do not fail the subscription if email delivery fails.
        console.error('Failed to send welcome email:', err)
      }
    }

    return NextResponse.json({ ...result, emailSent })
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

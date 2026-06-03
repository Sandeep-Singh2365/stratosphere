import { Resend } from 'resend'

type WelcomeEmailInput = {
  to: string
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

function getFromAddress(): string {
  // Prefer an env var so production can use a verified sender domain.
  // Fallback is safe for local dev, but Resend may reject unverified senders.
  return process.env.RESEND_FROM ?? 'Stratosphere <noreply@stratosphere.com>'
}

function buildWelcomeEmailHtml(): string {
  return `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background:#0b1220; padding:24px;">
    <div style="max-width:560px; margin:0 auto; background:#0f172a; border:1px solid #1e293b; border-radius:16px; overflow:hidden;">
      <div style="padding:22px 22px 12px;">
        <div style="font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:#60a5fa; font-weight:700;">
          Stratosphere Wire
        </div>
        <h1 style="margin:10px 0 0; font-size:22px; color:#ffffff; line-height:1.25;">
          Welcome — you’re subscribed
        </h1>
        <p style="margin:10px 0 0; color:#94a3b8; font-size:14px; line-height:1.6;">
          Thanks for joining Stratosphere. You’ll receive curated geopolitical analysis and research highlights.
        </p>
      </div>

      <div style="padding:0 22px 22px;">
        <div style="background:#0b1220; border:1px solid #1e293b; border-radius:12px; padding:14px;">
          <p style="margin:0; color:#e2e8f0; font-size:13px; line-height:1.6;">
            You can explore:
            <a style="color:#60a5fa; text-decoration:none;" href="https://example.com/wire">Stratosphere Wire</a>
            and
            <a style="color:#f59e0b; text-decoration:none;" href="https://example.com/institute">Stratosphere Institute</a>.
          </p>
        </div>

        <p style="margin:14px 0 0; color:#64748b; font-size:12px; line-height:1.6;">
          If you didn’t request this subscription, you can ignore this email.
        </p>
      </div>

      <div style="border-top:1px solid #1e293b; padding:14px 22px; color:#64748b; font-size:12px;">
        © ${new Date().getFullYear()} Stratosphere
      </div>
    </div>
  </div>
  `
}

export async function sendNewsletterWelcomeEmail(input: WelcomeEmailInput): Promise<{ sent: boolean }> {
  const resend = getResendClient()
  if (!resend) return { sent: false }

  await resend.emails.send({
    from: getFromAddress(),
    to: input.to,
    subject: 'Welcome to Stratosphere',
    html: buildWelcomeEmailHtml(),
  })

  return { sent: true }
}


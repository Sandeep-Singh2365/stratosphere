import { getDb } from '@/lib/db'
import { ArticleWithMeta } from '@/types'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export const runtime = 'nodejs'

function stripPdfExtension(file: string) {
  return file.toLowerCase().endsWith('.pdf') ? file.slice(0, -4) : file
}

function normalizeRows<T>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[]
  if (
    typeof result === 'object' &&
    result !== null &&
    'rows' in result &&
    Array.isArray((result as Record<string, unknown>).rows)
  ) {
    return ((result as Record<string, unknown>).rows as T[]) ?? []
  }
  return []
}

function markdownToPlainText(md: string) {
  // Minimal markdown cleanup for PDF output.
  return (
    md
      // remove code fences
      .replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ''))
      // inline code
      .replace(/`([^`]+)`/g, '$1')
      // headings / emphasis / links
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
  )
}

async function findArticleForPdf(file: string): Promise<ArticleWithMeta | null> {
  const sql = getDb()
  const pdfPath = `/papers/${file}`
  const base = stripPdfExtension(file)

  // 1) Preferred: explicit pdf_url match
  const byPdfUrl = await sql`
    SELECT articles.* FROM articles
    WHERE articles.pdf_url = ${pdfPath}
      AND articles.is_published = true
    LIMIT 1
  `
  const pdfUrlRows = normalizeRows<ArticleWithMeta>(byPdfUrl)
  if (pdfUrlRows[0]) return pdfUrlRows[0]

  // 2) Fallback: slug match (allows /papers/{slug}.pdf)
  const bySlug = await sql`
    SELECT articles.* FROM articles
    WHERE articles.slug = ${base}
      AND articles.is_published = true
    LIMIT 1
  `
  const slugRows = normalizeRows<ArticleWithMeta>(bySlug)
  return slugRows[0] ?? null
}

function wrapText(opts: {
  text: string
  font: { widthOfTextAtSize: (t: string, s: number) => number }
  fontSize: number
  maxWidth: number
}): string[] {
  const words = opts.text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w
    const width = opts.font.widthOfTextAtSize(candidate, opts.fontSize)
    if (width <= opts.maxWidth) {
      current = candidate
    } else {
      if (current) lines.push(current)
      // if a single word is too long, hard-break it
      if (opts.font.widthOfTextAtSize(w, opts.fontSize) > opts.maxWidth) {
        let chunk = ''
        for (const ch of w) {
          const cand2 = chunk + ch
          if (opts.font.widthOfTextAtSize(cand2, opts.fontSize) > opts.maxWidth) {
            if (chunk) lines.push(chunk)
            chunk = ch
          } else {
            chunk = cand2
          }
        }
        if (chunk) {
          current = chunk
        } else {
          current = ''
        }
      } else {
        current = w
      }
    }
  }
  if (current) lines.push(current)
  return lines
}

async function buildPdfBytes(article: ArticleWithMeta): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.setTitle(article.title)
  pdfDoc.setAuthor(article.analyst_name ?? 'Stratosphere Institute')

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const pageWidth = 595.28 // A4 points
  const pageHeight = 841.89
  const margin = 54
  const maxWidth = pageWidth - margin * 2

  const titleSize = 20
  const metaSize = 10
  const headingSize = 12
  const bodySize = 11

  const lineGap = 3
  const lineHeight = (size: number) => size + lineGap

  const metaLine = `${article.analyst_name ?? 'Stratosphere Institute'} • ${new Date(
    article.published_at
  ).toLocaleDateString()}`

  const bodyTextParts: Array<{ kind: 'title' | 'meta' | 'heading' | 'body'; text: string }> = [
    { kind: 'title', text: article.title },
    { kind: 'meta', text: metaLine },
  ]

  if (article.abstract) {
    bodyTextParts.push({ kind: 'heading', text: 'Abstract' })
    bodyTextParts.push({ kind: 'body', text: markdownToPlainText(article.abstract) })
  }
  bodyTextParts.push({ kind: 'body', text: markdownToPlainText(article.content ?? '') })

  let page = pdfDoc.addPage([pageWidth, pageHeight])
  let y = pageHeight - margin

  const newPage = () => {
    page = pdfDoc.addPage([pageWidth, pageHeight])
    y = pageHeight - margin
  }

  for (const block of bodyTextParts) {
    const isTitle = block.kind === 'title'
    const isMeta = block.kind === 'meta'
    const isHeading = block.kind === 'heading'

    const font = isTitle || isHeading ? fontBold : fontRegular
    const fontSize = isTitle ? titleSize : isMeta ? metaSize : isHeading ? headingSize : bodySize
    const color = isMeta ? rgb(0.33, 0.33, 0.33) : rgb(0, 0, 0)

    const paragraphs = block.text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    for (const para of paragraphs) {
      const lines = wrapText({ text: para, font, fontSize, maxWidth })
      for (const line of lines) {
        if (y - lineHeight(fontSize) < margin) newPage()
        page.drawText(line, { x: margin, y: y - fontSize, size: fontSize, font, color })
        y -= lineHeight(fontSize)
      }

      // paragraph spacing
      y -= lineHeight(fontSize)
    }

    // block spacing
    if (isTitle) y -= 6
    if (isHeading) y -= 4
    if (isMeta) y -= 10
  }

  return await pdfDoc.save()
}

export async function GET(
  _req: Request,
  { params }: { params: { file: string } }
) {
  const article = await findArticleForPdf(params.file)
  if (!article) {
    return new Response('Not found', { status: 404 })
  }

  const pdf = await buildPdfBytes(article)
  const filename = params.file.toLowerCase().endsWith('.pdf')
    ? params.file
    : `${params.file}.pdf`

  // Ensure the backing buffer is a plain ArrayBuffer (not ArrayBufferLike).
  const bytes = Uint8Array.from(pdf)
  return new Response(bytes.buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      // reasonable caching (tune later if needed)
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

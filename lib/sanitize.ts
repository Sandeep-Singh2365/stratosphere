export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 500)
}

export function sanitizeEmail(input: string): string {
  return input.trim().toLowerCase().slice(0, 254)
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 200)
}

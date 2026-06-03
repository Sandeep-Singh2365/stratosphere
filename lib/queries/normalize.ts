/**
 * Lightweight helpers for normalizing Neon/sql results across the app.
 * We keep this file dependency-free so it can be used from any query module.
 */

export function hasRows(result: unknown): result is { rows: unknown[] } {
  return (
    typeof result === 'object' &&
    result !== null &&
    'rows' in result &&
    Array.isArray((result as Record<string, unknown>).rows)
  )
}

/**
 * Neon can return either `Row[]` directly OR an object with a `rows` array,
 * depending on client/version/config. This normalizes both cases into `T[]`.
 */
export function normalizeRows<T>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[]
  if (hasRows(result)) return (result.rows as T[]) ?? []
  return []
}


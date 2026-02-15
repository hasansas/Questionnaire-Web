/**
 * Convert string into URL-safe slug
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with -
    .replace(/^-+|-+$/g, '') // trim - from start/end
}
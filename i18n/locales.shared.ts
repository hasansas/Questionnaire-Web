export const LOCALES = ['en', 'id'] as const
export type LocaleCode = (typeof LOCALES)[number]

export function normalizeLocale(input?: unknown): string {
  return String(input ?? '').trim().toLowerCase()
}

export function isLocaleCode(input?: unknown): input is LocaleCode {
  const s = normalizeLocale(input)
  return (LOCALES as readonly string[]).includes(s)
}

export function toLocaleCode(input?: unknown, fallback: LocaleCode = 'en'): LocaleCode {
  return isLocaleCode(input) ? normalizeLocale(input) as LocaleCode : fallback
}

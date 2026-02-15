// ~/composables/useLocale.ts
export type AppLocale = 'en' | 'id' | 'zh'

const COOKIE_KEY = 'sb_locale'

const SUPPORTED_LOCALES: AppLocale[] = ['en', 'id', 'zh']

export type LocaleOption = {
  code: AppLocale
  label: string
  flag: string
}

export const LOCALE_OPTIONS: LocaleOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'id', label: 'Bahasa', flag: '🇮🇩' },
  { code: 'zh', label: '中文', flag: '🇨🇳' }
]

function normalizeLocale(input?: string | null): AppLocale | null {
  if (!input) return null
  const s = String(input).trim().toLowerCase()

  // common forms: "en", "en-US", "id-ID", "zh-CN"
  const base = s.split('-')[0] as AppLocale
  return (SUPPORTED_LOCALES as string[]).includes(base) ? base : null
}

function detectBrowserLocale(): AppLocale {
  if (!import.meta.client) return 'en'

  const langs = (navigator.languages?.length ? navigator.languages : [navigator.language])
    .filter(Boolean)
    .map(l => normalizeLocale(l))
    .filter(Boolean) as AppLocale[]

  return langs[0] ?? 'en'
}

export function useLocale() {
  const cookie = useCookie<AppLocale | null>(COOKIE_KEY, {
    default: () => null,
    path: '/',
    sameSite: 'lax',
    // 1 year
    maxAge: 60 * 60 * 24 * 365
  })

  const locale = useState<AppLocale>('sb_locale_state', () => 'en')

  const init = () => {
    // 1) cookie wins (SSR-safe)
    const fromCookie = normalizeLocale(cookie.value)
    if (fromCookie) {
      locale.value = fromCookie
      return
    }

    // 2) otherwise use browser preference (client only), then persist
    const fromBrowser = detectBrowserLocale()
    locale.value = fromBrowser
    cookie.value = fromBrowser
  }

  const setLocale = (next: AppLocale) => {
    if (!SUPPORTED_LOCALES.includes(next)) return
    locale.value = next
    cookie.value = next
  }

  const currentOption = computed(
    () => LOCALE_OPTIONS.find(o => o.code === locale.value) ?? LOCALE_OPTIONS[0]
  )

  return {
    locale,
    init,
    setLocale,
    options: LOCALE_OPTIONS,
    currentOption
  }
}

import { toLocaleCode } from './i18n/locales.shared'

export default defineI18nConfig(() => {
  const { public: publicConfig } = useRuntimeConfig()

  return {
    legacy: false,
    fallbackLocale: toLocaleCode(publicConfig.defaultLocale, 'en'),
  }
})

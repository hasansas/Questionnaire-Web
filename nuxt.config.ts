// https://nuxt.com/docs/api/configuration/nuxt-config

import Markdown from 'vite-plugin-vue-markdown'
import { toLocaleCode } from './i18n/locales.shared'

export default defineNuxtConfig({
  devServer: {
    host: process.env.APP_HOST || '0.0.0.0',
    port: Number(process.env.APP_PORT) || 3355,
  },
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      title: "SuperBazi - Your Personal Bazi Analysis",
      meta: [
        {
          name: "description",
          content:
            "Super Bazi is an advanced BaZi (Four Pillars of Destiny) chart calculator. Instantly generate your personalized BaZi chart, analyze your destiny, and explore in-depth Chinese metaphysics—all in a beautiful, modern interface.",
        },
        {
          name: "keywords",
          content:
            "BaZi, Four Pillars, Destiny, Chinese Astrology, Birth Chart, Super Bazi, Element Analysis, Pillars of Destiny, Metaphysics, Feng Shui",
        },
        // Open Graph for social sharing
        {
          property: "og:title",
          content: "Super Bazi - BaZi Chart & Destiny Analysis",
        },
        {
          property: "og:description",
          content:
            "Create your BaZi chart and uncover your destiny with Super Bazi. Modern, accurate, and easy-to-use BaZi calculator.",
        },
        // { property: 'og:image', content: '/superbazi-og-image.png' },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Super Bazi" },
        // Twitter Card
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "Super Bazi - BaZi Chart & Destiny Analysis",
        },
        {
          name: "twitter:description",
          content:
            "Unlock your destiny with Super Bazi’s BaZi (Four Pillars) chart calculator and personalized metaphysical insights.",
        },
        // { name: 'twitter:image', content: '/superbazi-og-image.png' },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      // script: [
      //   { src: 'https://cdn.example.com/some-global-script.js', body: true } // `body: true` places it at end of <body>
      // ]
    },
  },
  modules: ["@nuxtjs/google-fonts", "@pinia/nuxt", "@nuxtjs/i18n"],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || "http://localhost:3000",
      apiKey: process.env.API_KEY || "api-key",
      i18nBaseUrl: process.env.APP_PUBLIC_BASE_URL || 'http://localhost:3355',
      APP_PUBLIC_BASE_URL: process.env.APP_PUBLIC_BASE_URL || '',
    },
  },
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
    "~/assets/styles/main.scss",
  ],
  googleFonts: {
    families: {
      Lato: [100, 300, 400, 700, 900], // Specify weights you need for Lato
    },
    display: "swap", // 'swap' for better performance (displays fallback font until Lato loads)
  },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/styles/_variables" as *;
            @use "@/assets/styles/mixins" as *;
          `,
        },
      },
    },
    plugins: [Markdown()]
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: toLocaleCode(process.env.APP_DEFAULT_LOCALE, 'en'),
    langDir: 'locales',
    locales: [
      {
        code: 'en',
        name: 'English',
        files: [
          'en/seo.json',
          'en/common.json',
          'en/nav.json',
          'en/home.json',
          'en/community.json',
          'en/footer.json',
        ]
      },
      {
        code: 'id',
        name: 'Bahasa Indonesia',
        files: [
          'id/seo.json',
          'id/common.json',
          'id/nav.json',
          'id/home.json',
          'id/community.json',
          'id/footer.json',
        ]
      }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'sb_locale',
      redirectOn: 'root'
    },
    vueI18n: './i18n.config.ts'
  },
  extensions: ['.vue', '.md']
});

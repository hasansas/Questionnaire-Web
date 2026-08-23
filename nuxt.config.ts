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
      title: "SB Questionnaire - Assessments & Insights for Organizations",
      meta: [
        {
          name: "description",
          content:
            "SB Questionnaire is a modern assessment platform for organizations. Create questionnaires, define scoring, collect responses, and generate clear, actionable insights—fast, secure, and easy to manage.",
        },
        {
          name: "keywords",
          content:
            "questionnaire app, assessment platform, survey builder, scoring rules, analytics, organization assessments, student assessment, employee assessment, SB",
        },

        // Open Graph
        {
          property: "og:title",
          content: "SB Questionnaire - Assessments & Insights",
        },
        {
          property: "og:description",
          content:
            "Build questionnaires, configure scoring, and turn responses into actionable insights for your organization.",
        },
        // { property: "og:image", content: "/sb-questionnaire-og.png" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "SB Questionnaire" },

        // Twitter Card
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "SB Questionnaire - Assessments & Insights",
        },
        {
          name: "twitter:description",
          content:
            "Create questionnaires, apply scoring, and generate insights for schools, universities, and teams—powered by SB.",
        },
        // { name: "twitter:image", content: "/sb-questionnaire-og.png" },
      ],
    },
  },
  modules: ["@nuxtjs/google-fonts", "@pinia/nuxt", "@nuxtjs/i18n"],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || "http://localhost:3000",
      apiKey: process.env.API_KEY || "api-key",
      i18nBaseUrl: process.env.APP_PUBLIC_BASE_URL || 'http://localhost:3355',
      WEB_BASE_URL: process.env.WEB_BASE_URL || '',
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

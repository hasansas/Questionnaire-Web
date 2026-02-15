
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases as mdiAliases, mdi } from 'vuetify/iconsets/mdi-svg' // Keep MDI if you want to mix
import { iconify, iconifyAliases } from '../utils/iconify-icons' // Adjust path as needed
import 'vuetify/styles'
import { defineNuxtPlugin } from '#app'

function getCssVar(name: string) {
  if (process.client) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  }
  return ''
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'iconify', // Set Iconify as the default icon set
      aliases: {
        ...mdiAliases, // Include default MDI aliases if you still use them
        ...iconifyAliases, // Include your custom Iconify aliases
      },
      sets: {
        mdi, // Keep MDI if you plan to use it alongside Iconify
        iconify, // Register your custom Iconify icon set
      },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: getCssVar('--color-primary') || '#6200ee',
            secondary: getCssVar('--color-secondary') || '#03DAC6',
            background: getCssVar('--color-background') || '#f8f9fb',
            surface: getCssVar('--color-surface') || '#fff',
            accent: getCssVar('--color-accent') || '#82B1FF',
            error: getCssVar('--color-error') || '#FF5252',
            info: getCssVar('--color-info') || '#2196F3',
            success: getCssVar('--color-success') || '#4CAF50',
            warning: getCssVar('--color-warning') || '#FFC107',
          },
        },
      },
    },
    ssr: false,
  })

  app.vueApp.use(vuetify)
})

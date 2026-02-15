import { Icon } from '@iconify/vue'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Icon', Icon)
})

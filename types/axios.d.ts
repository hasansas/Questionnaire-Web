// types/axios.d.ts

// Import Axios types
import type { AxiosInstance } from 'axios'

/**
 * Extend NuxtApp to provide correct typing for $axios injected in /plugins/axios.ts
 */
declare module '#app' {
  interface NuxtApp {
    $axios: AxiosInstance
  }
}

/**
 * (Optional) Enable $axios typing in Vue SFCs if used via `this.$axios`
 * Most people only need the NuxtApp extension above.
 */
import { ComponentCustomProperties } from 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
  }
}

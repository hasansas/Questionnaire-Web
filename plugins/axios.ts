// /plugins/axios.ts

import type { AxiosInstance, AxiosError } from 'axios'
import stringHex from '~/helpers/string.helper'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  const router = useRouter()

  // Determine cookie names from .env or fallback
  const accessCookieName =
    config.public.ACCESS_TOKEN || import.meta.env.ACCESS_TOKEN || 'sbt'
  const refreshCookieName =
    config.public.REFRESH_TOKEN || import.meta.env.REFRESH_TOKEN || 'sbr'

  // SSR-safe: only create Axios instance on client side
  if (!import.meta.client) {
    return nuxtApp.provide('axios', null)
  }

  const { default: axios } = await import('axios')
  const api: AxiosInstance = axios.create({
    baseURL: config.public.apiBase as string,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.public.apiKey as string,
    },
  })

  // ------------------------------
  // REQUEST INTERCEPTOR
  // ------------------------------
  api.interceptors.request.use(
    (req) => {
      // 🧠 Skip attaching access token if this is the refresh endpoint
      if (req.url?.includes('/auth/refresh')) {
        return req
      }

      const hexToken = useCookie<string | null>(accessCookieName, { watch: false }).value
      if (hexToken) {
        try {
          const decodedToken = stringHex.fromHex(hexToken)
          req.headers = req.headers || {}
          req.headers.Authorization = `Bearer ${decodedToken}`
        } catch (err) {
          console.warn('[Axios] Failed to decode access token from hex')
        }
      }
      return req
    },
    (error) => Promise.reject(error)
  )

  // ------------------------------
  // RESPONSE INTERCEPTOR
  // ------------------------------
  api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const originalRequest = error.config as any

      // Ignore network errors or missing response
      if (!error.response) return Promise.reject(error)

      // Skip /auth/refresh loop
      if (originalRequest?._retry || originalRequest?.url?.includes('/auth/refresh')) {
        return Promise.reject(error)
      }

      // --- Handle expired token ---
      if (error.response?.status === 401) {
        const hexAccess = useCookie<string | null>(accessCookieName, { watch: false }).value
        const hexRefresh = useCookie<string | null>(refreshCookieName, { watch: false }).value

        // Hydration Guard: both cookies missing → probably SSR hydration → ignore
        if (!hexAccess && !hexRefresh) {
          console.info('[Axios] Ignoring 401 during hydration (no cookies yet)')
          return Promise.reject(error)
        }

        originalRequest._retry = true

        if (hexRefresh) {
          try {
            // Decode refresh token from hex
            const refreshToken = stringHex.fromHex(hexRefresh)
            // Request new access token using refresh token in header
            const refreshRes = await api.post(
              '/v1/auth/refresh',
              {},
              {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              }
            )

            const newToken = (refreshRes.data as any)?.data?.accessToken
            const newRefresh = (refreshRes.data as any)?.data?.refreshToken

            if (newToken) {
              // Encode and store new tokens in cookies
              const cookieAccess = useCookie(accessCookieName, { sameSite: 'lax', watch: false })
              const cookieRefresh = useCookie(refreshCookieName, { sameSite: 'lax', watch: false })

              cookieAccess.value = stringHex.toHex(newToken)
              if (newRefresh) cookieRefresh.value = stringHex.toHex(newRefresh)

              // Immediately update the in-memory auth store too
              try {
                const authStore = useAuthStore()
                authStore.setToken(newToken)
                authStore.setRefreshToken(newRefresh)
              } catch {
                console.warn('[Axios] Auth store not available during refresh update')
              }

              // Retry the original request with the *fresh token*
              originalRequest.headers.Authorization = `Bearer ${newToken}`

              console.info('[Axios] Retrying request with new token...')
              return api.request(originalRequest)
            }

          } catch (err) {
            console.error('[Axios] Token refresh failed:', err)
          }
        }

        // --- Refresh failed → clear session + redirect ---
        console.warn('[Axios] Session expired → redirecting to /auth/login')
        useCookie(accessCookieName, { watch: false }).value = null
        useCookie(refreshCookieName, { watch: false }).value = null

        if (router.currentRoute.value.path !== '/auth/login') {
          await router.push('/auth/login')
        }
      }

      return Promise.reject(error)
    }
  )

  // ------------------------------
  // Provide global instance
  // ------------------------------
  nuxtApp.provide('axios', api)
})

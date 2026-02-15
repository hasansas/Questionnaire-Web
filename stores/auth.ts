// /stores/auth.ts

import { defineStore } from 'pinia'
import { createDefaultAuth, normalizeAuth, type AuthModel } from '~/models/auth'
import { normalizeUser, type UserModel } from '~/models/user'
import stringHex from '~/helpers/string.helper'

interface LoginPayload {
  identifier: string
  password: string
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
}

interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

/**
 * Auth Store
 * Handles user authentication state, cookies, and login/logout logic.
 * Uses hex-encoded tokens with session names from environment variables.
 * Includes automatic token refresh before expiry.
 */
export const useAuthStore = defineStore('auth', () => {
  const api = useApiService()
  const userStore = useUsersStore()

  // ------------------------------
  // State
  // ------------------------------

  // Detect session names from environment or default values
  const accessCookieName =
    import.meta.env.ACCESS_TOKEN ||
    process.env.ACCESS_TOKEN ||
    'sbt'

  const refreshCookieName =
    import.meta.env.REFRESH_TOKEN ||
    process.env.REFRESH_TOKEN ||
    'sbr'

  const auth = ref<AuthModel>(createDefaultAuth())

  // Cookies (persist SSR + client)
  const token = useCookie<string | null>(accessCookieName, { sameSite: 'lax' })
  const refreshToken = useCookie<string | null>(refreshCookieName, { sameSite: 'lax' })

  // ------------------------------
  // Utils
  // ------------------------------

  /**
   * Decode JWT payload safely
   */
  function decodeToken(token: string): Record<string, any> | null {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch {
      return null
    }
  }

  // ------------------------------
  // Actions
  // ------------------------------

  /**
   * Login user using email/username and password.
   * Automatically encodes password to hex and stores tokens in cookies.
   */
  async function login(payload: LoginPayload): Promise<ApiResult> {
    const identifier = payload.identifier
    const password = stringHex.toHex(payload.password)

    const res: ApiResult<LoginResponse> = await api.post('/v1/auth/login/regular', {
      identifier,
      password,
    })

    if (res.success) {
      // Save encoded tokens to cookies (SSR-safe)
      setToken(res.data.accessToken)
      setRefreshToken(res.data.refreshToken)

      // Fetch current user profile
      await userStore.fetchUser()
    }

    return res
  }

  /**
   * Refresh access token before expiry (called automatically by watcher).
   */
  async function refreshAccessToken() {
    try {
      if (!auth.value.refreshToken) return

      const res: ApiResult<RefreshResponse> = await api.post('/v1/auth/refresh', {
        refreshToken: auth.value.refreshToken,
      })

      if (res.success) {
        setToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        console.info('[Auth] Token auto-refreshed at', new Date().toISOString())
      } else {
        console.warn('[Auth] Failed to refresh token:', res.error)
        logout()
      }
    } catch (err) {
      console.error('[Auth] Token refresh error:', err)
      logout()
    }
  }

  /**
   * Logout user and clear all authentication data.
   * Removes cookies completely from the browser.
   */
  function logout() {
    try {
      // Clear Pinia state
      auth.value = createDefaultAuth()
      userStore.user = null

      // Remove cookies (explicit delete)
      const access = useCookie(accessCookieName, { sameSite: 'lax' })
      const refresh = useCookie(refreshCookieName, { sameSite: 'lax' })
      access.value = null
      refresh.value = null

      // Force cookie removal (client side)
      if (import.meta.client) {
        document.cookie = `${accessCookieName}=; Max-Age=0; path=/;`
        document.cookie = `${refreshCookieName}=; Max-Age=0; path=/;`
      }

      // Redirect to login
      navigateTo('/auth/login')
    } catch (err) {
      console.error('[Auth] Logout error:', err)
    }
  }

  /**
   * Update access token (used by interceptor after refresh).
   * When setting → encode to hex.
   * When reading → decode from hex.
   */
  function setToken(newToken: string | null) {
    if (newToken) {
      const hexToken = stringHex.toHex(newToken)
      token.value = hexToken

      // Decode for runtime use
      const decodedString = stringHex.fromHex(hexToken)
      const decodedPayload = decodeToken(decodedString)

      auth.value.token = decodedString
      auth.value.id = decodedPayload?.id ?? ''
      auth.value.role = decodedPayload?.role ?? 'regular'
      auth.value.isLoggedIn = true
    } else {
      token.value = null
      auth.value.token = ''
      auth.value.isLoggedIn = false
    }
  }

  /**
   * Update refresh token (used by interceptor or login).
   * When setting → encode to hex.
   * When reading → decode from hex.
   */
  function setRefreshToken(newToken: string | null) {
    if (newToken) {
      const hexToken = stringHex.toHex(newToken)
      refreshToken.value = hexToken
      auth.value.refreshToken = newToken
    } else {
      refreshToken.value = null
      auth.value.refreshToken = ''
    }
  }

  /**
   * Register a new user account.
   * Does NOT log the user in automatically (verification required).
   */
  async function register(
    payload: {
      name: string;
      email: string;
      password: string;
      countryId: number | null;
      stateId: number | null;
      cityId: number | null;
    }
  ): Promise<ApiResult> {
    const res: ApiResult<any> = await api.post('/v1/auth/register', payload)
    return res
  }

  /**
 * Request password reset email.
 */
  async function forgotPassword(
    payload: { email: string; confirmationUrl: string; }
  ): Promise<ApiResult> {
    const res: ApiResult = await api.post(
      '/v1/auth/password/forgot',
      payload
    )

    return res
  }

  /**
 * Reset password using verification code.
 */
  async function resetPassword(
    payload: { verificationCode: string; }
  ): Promise<ApiResult> {
    const res: ApiResult = await api.post(
      '/v1/auth/password/reset',
      payload
    )

    return res
  }


  // ------------------------------
  // Getters
  // ------------------------------

  /**
   * Checks login state from decoded access token.
   */
  const isLoggedIn = computed(() => !!auth.value.token && auth.value.isLoggedIn)

  // ------------------------------
  // Init: Restore session if cookie exists
  // ------------------------------
  if (token.value) {
    try {
      const decodedString = stringHex.fromHex(token.value)
      const decoded = decodeToken(decodedString)
      if (decoded) {
        auth.value = normalizeAuth({
          id: decoded.id ?? '',
          role: decoded.role ?? 'regular',
          token: decodedString,
          refreshToken: stringHex.fromHex(refreshToken.value || ''),
          isLoggedIn: true,
        })

        // Fetch current user profile
        userStore.fetchUser()
      }
    } catch {
      console.warn('[Auth] Failed to restore session from cookie')
    }
  }

  return {
    auth,
    token,
    refreshToken,
    isLoggedIn,
    login,
    logout,
    decodeToken,
    setToken,
    setRefreshToken,
    refreshAccessToken,
    register,
    forgotPassword,
    resetPassword
  }
})

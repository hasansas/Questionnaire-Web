// /stores/user.ts

import { defineStore } from 'pinia'
import {
  normalizeUser,
  normalizePreference,
  type UserModel,
  type UserPreferenceModel,
} from '~/models/user'

export const useUsersStore = defineStore('user', () => {
  const api = useApiService()

  // ------------------------------
  // State
  // ------------------------------

  const user = ref<UserModel | null>(null)

  // ------------------------------
  // Actions
  // ------------------------------

  /**
   * Fetch current authenticated user profile
   */
  async function fetchUser() {
    try {
      const res: ApiResult<UserModel> = await api.get('/v1/users/me')
      if (res.success) {
        user.value = normalizeUser(res.data)
      } else {
        console.warn('[User] Failed to fetch user:', res.error)
        user.value = null
      }
    } catch (err) {
      console.error('[User] Error fetching user:', err)
      user.value = null
    }
  }

  /**
   * Update current authenticated user profile
   * PATCH /v1/users/me
   *
   * Accepts partial payload, e.g. { name?, image? }.
   * After success, update local user state partially (no refetch).
   */
  async function updateUserProfile(
    payload: Partial<Pick<UserModel, 'name' | 'image'>>
  ) {
    const res: ApiResult<null> = await api.patch('/v1/users/me', payload)

    if (res.success && user.value) {
      user.value = {
        ...user.value,
        ...payload
      }
    }

    return res
  }

  /**
   * Fetch current authenticated user's preferences
   * GET /v1/users/me/preferences
   */
  async function fetchUserPreferences() {
    try {
      const res: ApiResult<UserPreferenceModel> = await api.get(
        '/v1/users/me/preferences'
      )

      if (res.success && user.value) {
        user.value.preference = normalizePreference(res.data)
      }
    } catch (err) {
      console.error('[User] Error fetching preferences:', err)
    }
  }

  /**
   * Update current authenticated user's preferences
   * PUT /v1/users/me/preferences
   *
   * Backend only updates fields that are provided.
   * After success, partially merge into local preference state.
   */
  async function updateUserPreferences(
    payload: Partial<UserPreferenceModel>
  ) {
    const res: ApiResult<null> = await api.put(
      '/v1/users/me/preferences',
      payload
    )

    // if (res.success && user.value) {
    if (user.value) {
      const current = user.value.preference ?? normalizePreference({} as any)

      // merge then normalize again to keep structure consistent
      user.value.preference = normalizePreference({
        ...current,
        ...payload
      } as UserPreferenceModel)
    }

    return res
  }

  return {
    // state
    user,

    // actions
    fetchUser,
    updateUserProfile,
    fetchUserPreferences,
    updateUserPreferences
  }
})

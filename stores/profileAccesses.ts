import { defineStore } from 'pinia'
import { useResourceStore } from '~/composables/useResourceStore'
import { normalizeProfileAccess, normalizeProfileAccesses, type ProfileAccessModel } from '~/models/profile-access'

export const useProfileAccessesStore = defineStore('accesses', () => {
  const apiEndpoint = '/v1/access/role'

  return useResourceStore<ProfileAccessModel>({
    endpoint: apiEndpoint,
    normalizedArray: normalizeProfileAccesses,
    normalizedJson: normalizeProfileAccess,
  })
})

import { defineStore } from 'pinia'
import { useResourceStore } from '~/composables/useResourceStore'
import { normalizeProfile, normalizeProfiles, type ProfileModel, type ProfileInputModel } from '~/models/profile'

export const useProfilesStore = defineStore('profiles', () => {
  const apiEndpoint = '/v1/profiles'

  return useResourceStore<ProfileModel, ProfileInputModel>({
    endpoint: apiEndpoint,
    normalizedArray: normalizeProfiles,
    normalizedJson: normalizeProfile,
  })
})

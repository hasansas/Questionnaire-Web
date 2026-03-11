import { defineStore } from 'pinia'
import {
  createDefaultOrganizationUserFieldConfig,
  normalizeOrganizationUserFieldConfig,
  type OrganizationUserFieldConfigModel,
} from '~/models/organization-user-field.model'

export const useOrganizationUserFieldStore = defineStore(
  'organizationUserField',
  () => {
    const api = useApiService()

    const item = ref<OrganizationUserFieldConfigModel>(
      createDefaultOrganizationUserFieldConfig()
    )
    const loading = ref(false)
    const loaded = ref(false)
    const error = ref<string | null>(null)

    function resetState() {
      item.value = createDefaultOrganizationUserFieldConfig()
      loading.value = false
      loaded.value = false
      error.value = null
    }

    async function fetchByOrganizationId(organizationId: string) {
      const normalizedOrganizationId = String(organizationId || '').trim()

      if (!normalizedOrganizationId) {
        error.value = 'Organization ID is required.'
        item.value = createDefaultOrganizationUserFieldConfig()
        loaded.value = false
        return null
      }

      loading.value = true
      error.value = null

      try {
        const response: ApiResult = await api.get(
          `/v1/organizations/${normalizedOrganizationId}/user-fields`
        )

        if (!response?.success) {
          throw new Error(
            response?.error?.message || 'Failed to fetch user fields.'
          )
        }

        const payload = response.data ?? undefined
        const normalized = normalizeOrganizationUserFieldConfig(payload)

        item.value = normalized
        loaded.value = true

        return normalized
      } catch (err: any) {
        item.value = createDefaultOrganizationUserFieldConfig()
        loaded.value = false
        error.value =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to fetch user fields.'
        return null
      } finally {
        loading.value = false
      }
    }

    return {
      item,
      loading,
      loaded,
      error,

      resetState,
      fetchByOrganizationId,
    }
  }
)

import { defineStore } from 'pinia'
import {
  createDefaultOrganizationQuestionnaire,
  normalizeOrganizationQuestionnaire,
  type OrganizationQuestionnaireModel,
} from '~/models/organization-questionnaire.model'

export const useOrganizationQuestionnaireStore = defineStore(
  'organizationQuestionnaire',
  () => {
    const api = useApiService()

    const item = ref<OrganizationQuestionnaireModel>(
      createDefaultOrganizationQuestionnaire()
    )
    const loading = ref(false)
    const loaded = ref(false)
    const error = ref<string | null>(null)

    /**
     * Reset store state
     */
    function resetState() {
      item.value = createDefaultOrganizationQuestionnaire()
      loading.value = false
      loaded.value = false
      error.value = null
    }

    /**
     * Fetch organization + questionnaire by public questionnaire code
     * Example: /v1/q/q-mca1c251hb7w
     */
    async function fetchByCode(code: string) {
      const normalizedCode = String(code || '').trim()

      if (!normalizedCode) {
        error.value = 'Questionnaire code is required.'
        item.value = createDefaultOrganizationQuestionnaire()
        loaded.value = false
        return null
      }

      loading.value = true
      error.value = null

      try {
        const response: ApiResult = await api.get(
          `/v1/q/${normalizedCode}`
        )

        if (!response?.success) {
          throw new Error(response?.error?.message || 'Failed to fetch questionnaire.')
        }

        const payload = response.data ?? undefined
        const normalized = normalizeOrganizationQuestionnaire(
          payload
        )

        item.value = normalized
        loaded.value = true

        return normalized
      } catch (err: any) {
        item.value = createDefaultOrganizationQuestionnaire()
        loaded.value = false
        error.value =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to fetch questionnaire.'
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
      fetchByCode,
    }
  }
)
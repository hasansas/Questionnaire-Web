// /stores/org-reports.ts

import { defineStore } from 'pinia'

export interface ReportUserModel {
  name: string
  email: string
}

export interface ReportRowModel {
  id: string
  questionnaire_code: string
  questionnaire_title: string
  questionnaire_version: number
  status: 'in_progress' | 'submitted'
  started_at: string
  submitted_at: string | null
  result_label: string | null
  user: ReportUserModel
}

export interface QuestionnaireOptionModel {
  code: string
  title: string
}

/**
 * Org Reports Store
 *
 * Fetches paginated reports for the authenticated organization.
 * Endpoint: GET /v1/organizations/:orgId/reports
 *
 * Follows the same interface contract as useResourceStore so that
 * SbResourceTableCard can consume it directly.
 */
export const useOrgReportsStore = defineStore('orgReports', () => {
  const api = useApiService()
  const authStore = useAuthStore()
  const paginated = usePaginatedStore<ReportRowModel>(20)

  const questionnaireOptions = ref<QuestionnaireOptionModel[]>([])

  /**
   * Fetch one page of reports.
   * query: URL query string built by SbResourceTableCard's buildQuery (excludes page).
   */
  async function fetchAll({
    page = 1,
    query = null,
    reset = false,
  }: {
    page?: number
    query?: string | null
    reset?: boolean
  }): Promise<{ success: boolean; error?: string }> {
    try {
      if (reset) paginated.resetData()

      const orgId = authStore.auth.organizationId
      const queryParams = query ? `${query}&page=${page}` : `page=${page}`
      const url = `/v1/organizations/${orgId}/reports?${queryParams}`

      const res: ApiResult<any> = await api.get(url)

      if (!res.success) {
        throw new Error((res.error as any)?.message || 'Failed to fetch reports')
      }

      const { rows, pagination, questionnaire_options } = res.data

      paginated.putData(rows ?? [], pagination)

      if (Array.isArray(questionnaire_options) && questionnaire_options.length) {
        questionnaireOptions.value = questionnaire_options
      }

      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to fetch reports' }
    }
  }

  return {
    data: paginated.data,
    resetData: paginated.resetData,
    questionnaireOptions,
    fetchAll,
  }
})

import { defineStore } from 'pinia'

export interface QuestionnaireAttemptUserInfoFieldModel {
  key: string
  value: string
}

export interface StartQuestionnaireAttemptPayload {
  questionnaireId: string
  organizationId: string
  organizationQuestionnaireId: string
  userInfo: {
    fields: QuestionnaireAttemptUserInfoFieldModel[]
  }
}

export interface QuestionnaireAttemptModel {
  id: string
  questionnaireId: string
  organizationId: string
  organizationQuestionnaireId: string
  userId: string | null
  questionnaireVersion: number
  status: string
  startedAt: Date | null
  submittedAt: Date | null
}

export interface AttemptQuestionnaireModel {
  id: string
  code: string
  title: string
  description: string | null
  shortDescription: string | null
  instructions: string | null
  estimatedTimeMinutes: number | null
  totalQuestions: number | null
  language: string
  status: string
  version: number
  scoringType: string
  showResultToUser: boolean
  optionsMode: string
}

export interface AttemptProgressModel {
  totalQuestions: number
  answeredQuestions: number
  currentQuestionNumber: number
  isFirstQuestion: boolean
  isLastQuestion: boolean
  isComplete: boolean
}

export interface AttemptQuestionOptionModel {
  id: string | null
  questionId: string | null
  key: string
  label: string
  scoreValue: number | null
  sortOrder: number | null
}

export interface AttemptSavedAnswerModel {
  id: string
  attemptId: string
  questionId: string
  optionId: string | null
  fixedOptionKey: string | null
  labelSnapshot: string | null
  scoreValueSnapshot: number | null
  createdAt: Date | null
  updatedAt: Date | null
}

export interface AttemptQuestionModel {
  id: string
  questionnaireId: string
  code: string | null
  text: string
  description: string | null
  questionType: string
  isRequired: boolean
  sortOrder: number | null
  meta: Record<string, any> | null
  options: AttemptQuestionOptionModel[]
  savedAnswer: AttemptSavedAnswerModel | null
  nextQuestionId: string | null
  prevQuestionId: string | null
}

export interface AttemptQuestionSessionModel {
  attempt: QuestionnaireAttemptModel
  questionnaire: AttemptQuestionnaireModel
  progress: AttemptProgressModel
  question: AttemptQuestionModel
}

export interface SaveAttemptAnswerItemPayload {
  questionId: string
  optionId?: string | null
  fixedOptionKey?: string | null
}

export interface SaveAttemptAnswerPayload {
  attemptId: string
  answers: SaveAttemptAnswerItemPayload[]
}

export interface SaveAttemptAnswerResultModel {
  saved: boolean
  attemptId: string
  progress: AttemptProgressModel
  currentQuestionId: string | null
  prevQuestionId: string | null
  nextQuestionId: string | null
}

export const createDefaultQuestionnaireAttempt =
  (): QuestionnaireAttemptModel => ({
    id: '',
    questionnaireId: '',
    organizationId: '',
    organizationQuestionnaireId: '',
    userId: null,
    questionnaireVersion: 0,
    status: '',
    startedAt: null,
    submittedAt: null,
  })

export const createDefaultAttemptQuestionnaire =
  (): AttemptQuestionnaireModel => ({
    id: '',
    code: '',
    title: '',
    description: null,
    shortDescription: null,
    instructions: null,
    estimatedTimeMinutes: null,
    totalQuestions: null,
    language: '',
    status: '',
    version: 0,
    scoringType: '',
    showResultToUser: false,
    optionsMode: '',
  })

export const createDefaultAttemptProgress = (): AttemptProgressModel => ({
  totalQuestions: 0,
  answeredQuestions: 0,
  currentQuestionNumber: 0,
  isFirstQuestion: false,
  isLastQuestion: false,
  isComplete: false,
})

export const createDefaultAttemptQuestionOption =
  (): AttemptQuestionOptionModel => ({
    id: null,
    questionId: null,
    key: '',
    label: '',
    scoreValue: null,
    sortOrder: null,
  })

export const createDefaultAttemptSavedAnswer =
  (): AttemptSavedAnswerModel => ({
    id: '',
    attemptId: '',
    questionId: '',
    optionId: null,
    fixedOptionKey: null,
    labelSnapshot: null,
    scoreValueSnapshot: null,
    createdAt: null,
    updatedAt: null,
  })

export const createDefaultAttemptQuestion = (): AttemptQuestionModel => ({
  id: '',
  questionnaireId: '',
  code: null,
  text: '',
  description: null,
  questionType: '',
  isRequired: false,
  sortOrder: null,
  meta: null,
  options: [],
  savedAnswer: null,
  nextQuestionId: null,
  prevQuestionId: null,
})

export const createDefaultAttemptQuestionSession =
  (): AttemptQuestionSessionModel => ({
    attempt: createDefaultQuestionnaireAttempt(),
    questionnaire: createDefaultAttemptQuestionnaire(),
    progress: createDefaultAttemptProgress(),
    question: createDefaultAttemptQuestion(),
  })

export const createDefaultSaveAttemptAnswerResult =
  (): SaveAttemptAnswerResultModel => ({
    saved: false,
    attemptId: '',
    progress: createDefaultAttemptProgress(),
    currentQuestionId: null,
    prevQuestionId: null,
    nextQuestionId: null,
  })

export function normalizeQuestionnaireAttempt(
  item?: Partial<QuestionnaireAttemptModel>
): QuestionnaireAttemptModel {
  return {
    id: item?.id ?? '',
    questionnaireId: item?.questionnaireId ?? '',
    organizationId: item?.organizationId ?? '',
    organizationQuestionnaireId: item?.organizationQuestionnaireId ?? '',
    userId: item?.userId ?? null,
    questionnaireVersion: item?.questionnaireVersion ?? 0,
    status: item?.status ?? '',
    startedAt: item?.startedAt ? new Date(item.startedAt) : null,
    submittedAt: item?.submittedAt ? new Date(item.submittedAt) : null,
  }
}

export function normalizeAttemptQuestionnaire(
  item?: Partial<AttemptQuestionnaireModel>
): AttemptQuestionnaireModel {
  return {
    id: item?.id ?? '',
    code: item?.code ?? '',
    title: item?.title ?? '',
    description: item?.description ?? null,
    shortDescription: item?.shortDescription ?? null,
    instructions: item?.instructions ?? null,
    estimatedTimeMinutes: item?.estimatedTimeMinutes ?? null,
    totalQuestions: item?.totalQuestions ?? null,
    language: item?.language ?? '',
    status: item?.status ?? '',
    version: item?.version ?? 0,
    scoringType: item?.scoringType ?? '',
    showResultToUser: item?.showResultToUser ?? false,
    optionsMode: item?.optionsMode ?? '',
  }
}

export function normalizeAttemptProgress(
  item?: Partial<AttemptProgressModel>
): AttemptProgressModel {
  return {
    totalQuestions: item?.totalQuestions ?? 0,
    answeredQuestions: item?.answeredQuestions ?? 0,
    currentQuestionNumber: item?.currentQuestionNumber ?? 0,
    isFirstQuestion: item?.isFirstQuestion ?? false,
    isLastQuestion: item?.isLastQuestion ?? false,
    isComplete: item?.isComplete ?? false,
  }
}

export function normalizeAttemptQuestionOption(
  item?: Partial<AttemptQuestionOptionModel>
): AttemptQuestionOptionModel {
  return {
    id: item?.id ?? null,
    questionId: item?.questionId ?? null,
    key: item?.key ?? '',
    label: item?.label ?? '',
    scoreValue:
      typeof item?.scoreValue === 'number' ? item.scoreValue : null,
    sortOrder: typeof item?.sortOrder === 'number' ? item.sortOrder : null,
  }
}

export function normalizeAttemptQuestionOptions(
  items?: Partial<AttemptQuestionOptionModel>[]
): AttemptQuestionOptionModel[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeAttemptQuestionOption(item))
}

export function normalizeAttemptSavedAnswer(
  item?: Partial<AttemptSavedAnswerModel>
): AttemptSavedAnswerModel {
  return {
    id: item?.id ?? '',
    attemptId: item?.attemptId ?? '',
    questionId: item?.questionId ?? '',
    optionId: item?.optionId ?? null,
    fixedOptionKey: item?.fixedOptionKey ?? null,
    labelSnapshot: item?.labelSnapshot ?? null,
    scoreValueSnapshot:
      typeof item?.scoreValueSnapshot === 'number'
        ? item.scoreValueSnapshot
        : null,
    createdAt: item?.createdAt ? new Date(item.createdAt) : null,
    updatedAt: item?.updatedAt ? new Date(item.updatedAt) : null,
  }
}

export function normalizeAttemptQuestion(
  item?: Partial<AttemptQuestionModel>
): AttemptQuestionModel {
  return {
    id: item?.id ?? '',
    questionnaireId: item?.questionnaireId ?? '',
    code: item?.code ?? null,
    text: item?.text ?? '',
    description: item?.description ?? null,
    questionType: item?.questionType ?? '',
    isRequired: item?.isRequired ?? false,
    sortOrder: typeof item?.sortOrder === 'number' ? item.sortOrder : null,
    meta: item?.meta ?? null,
    options: normalizeAttemptQuestionOptions(item?.options),
    savedAnswer: item?.savedAnswer
      ? normalizeAttemptSavedAnswer(item.savedAnswer)
      : null,
    nextQuestionId: item?.nextQuestionId ?? null,
    prevQuestionId: item?.prevQuestionId ?? null,
  }
}

export function normalizeAttemptQuestionSession(
  item?: Partial<AttemptQuestionSessionModel>
): AttemptQuestionSessionModel {
  return {
    attempt: normalizeQuestionnaireAttempt(item?.attempt),
    questionnaire: normalizeAttemptQuestionnaire(item?.questionnaire),
    progress: normalizeAttemptProgress(item?.progress),
    question: normalizeAttemptQuestion(item?.question),
  }
}

export function normalizeSaveAttemptAnswerResult(
  item?: Partial<SaveAttemptAnswerResultModel>
): SaveAttemptAnswerResultModel {
  return {
    saved: item?.saved ?? false,
    attemptId: item?.attemptId ?? '',
    progress: normalizeAttemptProgress(item?.progress),
    currentQuestionId: item?.currentQuestionId ?? null,
    prevQuestionId: item?.prevQuestionId ?? null,
    nextQuestionId: item?.nextQuestionId ?? null,
  }
}

export const useQuestionnaireAttemptStore = defineStore(
  'questionnaireAttempt',
  () => {
    const api = useApiService()

    const item = ref<QuestionnaireAttemptModel>(
      createDefaultQuestionnaireAttempt()
    )
    const currentQuestionSession = ref<AttemptQuestionSessionModel>(
      createDefaultAttemptQuestionSession()
    )
    const saveAnswerResult = ref<SaveAttemptAnswerResultModel>(
      createDefaultSaveAttemptAnswerResult()
    )

    function resetState() {
      item.value = createDefaultQuestionnaireAttempt()
      currentQuestionSession.value = createDefaultAttemptQuestionSession()
      saveAnswerResult.value = createDefaultSaveAttemptAnswerResult()
    }

    function resetQuestionState() {
      currentQuestionSession.value = createDefaultAttemptQuestionSession()
    }

    function resetSaveAnswerState() {
      saveAnswerResult.value = createDefaultSaveAttemptAnswerResult()
    }

    async function startAttempt(payload: StartQuestionnaireAttemptPayload) {
      const questionnaireId = String(payload?.questionnaireId || '').trim()
      const organizationId = String(payload?.organizationId || '').trim()
      const organizationQuestionnaireId = String(
        payload?.organizationQuestionnaireId || ''
      ).trim()

      if (!questionnaireId) {
        item.value = createDefaultQuestionnaireAttempt()
        return null
      }

      if (!organizationId) {
        item.value = createDefaultQuestionnaireAttempt()
        return null
      }

      if (!organizationQuestionnaireId) {
        item.value = createDefaultQuestionnaireAttempt()
        return null
      }

      try {
        const response: ApiResult = await api.post(
          `/v1/questionnaires/${questionnaireId}/attempts`,
          {
            userInfo: {
              fields: Array.isArray(payload?.userInfo?.fields)
                ? payload.userInfo.fields.map((field) => ({
                  key: String(field?.key || '').trim(),
                  value: String(field?.value ?? ''),
                }))
                : [],
            },
            organizationId,
            organizationQuestionnaireId,
          }
        )

        if (!response?.success) {
          throw new Error(
            response?.error?.message ||
            'Failed to start questionnaire attempt.'
          )
        }

        const normalized = normalizeQuestionnaireAttempt(response.data)
        item.value = normalized

        return normalized
      } catch {
        item.value = createDefaultQuestionnaireAttempt()
        return null
      }
    }

    async function getCurrentQuestion(attemptId: string) {
      const normalizedAttemptId = String(attemptId || '').trim()

      if (!normalizedAttemptId) {
        currentQuestionSession.value = createDefaultAttemptQuestionSession()
        return null
      }

      try {
        const response: ApiResult = await api.get(
          `/v1/attempts/${normalizedAttemptId}/current-question`
        )

        if (!response?.success) {
          throw new Error(
            response?.error?.message || 'Failed to load current question.'
          )
        }

        const normalized = normalizeAttemptQuestionSession(response.data)

        currentQuestionSession.value = normalized
        item.value = normalized.attempt

        return normalized
      } catch {
        currentQuestionSession.value = createDefaultAttemptQuestionSession()
        return null
      }
    }

    async function getQuestionById(attemptId: string, questionId: string) {
      const normalizedAttemptId = String(attemptId || '').trim()
      const normalizedQuestionId = String(questionId || '').trim()

      if (!normalizedAttemptId) {
        currentQuestionSession.value = createDefaultAttemptQuestionSession()
        return null
      }

      if (!normalizedQuestionId) {
        currentQuestionSession.value = createDefaultAttemptQuestionSession()
        return null
      }

      try {
        const response: ApiResult = await api.get(
          `/v1/attempts/${normalizedAttemptId}/questions/${normalizedQuestionId}`
        )

        if (!response?.success) {
          throw new Error(
            response?.error?.message || 'Failed to load question.'
          )
        }

        const normalized = normalizeAttemptQuestionSession(response.data)

        currentQuestionSession.value = normalized
        item.value = normalized.attempt

        return normalized
      } catch {
        currentQuestionSession.value = createDefaultAttemptQuestionSession()
        return null
      }
    }

    async function saveAnswer(payload: SaveAttemptAnswerPayload) {
      const normalizedAttemptId = String(payload?.attemptId || '').trim()

      if (!normalizedAttemptId) {
        saveAnswerResult.value = createDefaultSaveAttemptAnswerResult()
        return null
      }

      const answers = Array.isArray(payload?.answers)
        ? payload.answers
          .map((answer) => ({
            questionId: String(answer?.questionId || '').trim(),
            optionId: answer?.optionId ? String(answer.optionId).trim() : null,
            fixedOptionKey: answer?.fixedOptionKey
              ? String(answer.fixedOptionKey).trim()
              : null,
          }))
          .filter((answer) => {
            if (!answer.questionId) return false
            if (answer.optionId) return true
            if (answer.fixedOptionKey) return true
            return false
          })
        : []

      if (!answers.length) {
        saveAnswerResult.value = createDefaultSaveAttemptAnswerResult()
        return null
      }

      try {
        const response: ApiResult = await api.post(
          `/v1/attempts/${normalizedAttemptId}/answers`,
          { answers }
        )

        if (!response?.success) {
          throw new Error(
            response?.error?.message || 'Failed to save answer.'
          )
        }

        const normalized = normalizeSaveAttemptAnswerResult(response.data)
        saveAnswerResult.value = normalized

        return normalized
      } catch {
        saveAnswerResult.value = createDefaultSaveAttemptAnswerResult()
        return null
      }
    }

    async function submitAttempt(attemptId: string) {
      const normalizedAttemptId = String(attemptId || '').trim()

      if (!normalizedAttemptId) return null

      try {
        const response: ApiResult = await api.post(
          `/v1/attempts/${normalizedAttemptId}/submit`,
          {}
        )

        if (!response?.success) {
          throw new Error(
            response?.error?.message || 'Failed to submit attempt.'
          )
        }

        return response.data || null
      } catch {
        return null
      }
    }

    return {
      item,
      currentQuestionSession,
      saveAnswerResult,

      resetState,
      resetQuestionState,
      resetSaveAnswerState,

      startAttempt,
      getCurrentQuestion,
      getQuestionById,
      saveAnswer,
      submitAttempt,
    }
  }
)

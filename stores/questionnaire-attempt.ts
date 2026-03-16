import { defineStore } from 'pinia'
import {
  createDefaultQuestionnaireAttempt,
  normalizeQuestionnaireAttempt,
  type QuestionnaireAttemptModel,
} from '~/models/questionnaire-attempt.model'
import {
  createDefaultAttemptQuestionSession,
  normalizeAttemptQuestionSession,
  type AttemptQuestionSessionModel,
} from '~/models/attempt-question-session.model'
import {
  createDefaultSaveAttemptAnswerResult,
  normalizeSaveAttemptAnswerResult,
  type SaveAttemptAnswerResultModel,
} from '~/models/save-attempt-answer-result.model'
import {
  createDefaultQuestionnaireAttemptResult,
  normalizeQuestionnaireAttemptResult,
  type QuestionnaireAttemptResultModel,
} from '~/models/questionnaire-attempt-result.model'

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

export interface SaveAttemptAnswerItemPayload {
  questionId: string
  optionId?: string | null
  fixedOptionKey?: string | null
}

export interface SaveAttemptAnswerPayload {
  attemptId: string
  answers: SaveAttemptAnswerItemPayload[]
}

export const useQuestionnaireAttemptStore = defineStore(
  'questionnaireAttempt',
  () => {
    const api = useApiService()

    const item = ref<QuestionnaireAttemptModel>(
      createDefaultQuestionnaireAttempt(),
    )
    const currentQuestionSession = ref<AttemptQuestionSessionModel>(
      createDefaultAttemptQuestionSession(),
    )
    const saveAnswerResult = ref<SaveAttemptAnswerResultModel>(
      createDefaultSaveAttemptAnswerResult(),
    )
    const resultItem = ref<QuestionnaireAttemptResultModel>(
      createDefaultQuestionnaireAttemptResult(),
    )

    function resetState() {
      item.value = createDefaultQuestionnaireAttempt()
      currentQuestionSession.value = createDefaultAttemptQuestionSession()
      saveAnswerResult.value = createDefaultSaveAttemptAnswerResult()
      resultItem.value = createDefaultQuestionnaireAttemptResult()
    }

    function resetQuestionState() {
      currentQuestionSession.value = createDefaultAttemptQuestionSession()
    }

    function resetSaveAnswerState() {
      saveAnswerResult.value = createDefaultSaveAttemptAnswerResult()
    }

    function resetResultState() {
      resultItem.value = createDefaultQuestionnaireAttemptResult()
    }

    async function startAttempt(payload: StartQuestionnaireAttemptPayload) {
      const questionnaireId = String(payload?.questionnaireId || '').trim()
      const organizationId = String(payload?.organizationId || '').trim()
      const organizationQuestionnaireId = String(
        payload?.organizationQuestionnaireId || '',
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
          },
        )

        if (!response?.success) {
          throw new Error(
            response?.error?.message ||
            'Failed to start questionnaire attempt.',
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
          `/v1/attempts/${normalizedAttemptId}/current-question`,
        )

        if (!response?.success) {
          throw new Error(
            response?.error?.message || 'Failed to load current question.',
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
          `/v1/attempts/${normalizedAttemptId}/questions/${normalizedQuestionId}`,
        )

        if (!response?.success) {
          throw new Error(
            response?.error?.message || 'Failed to load question.',
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
          { answers },
        )

        if (!response?.success) {
          throw new Error(response?.error?.message || 'Failed to save answer.')
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
          {},
        )

        if (!response?.success) {
          throw new Error(
            response?.error?.message || 'Failed to submit attempt.',
          )
        }

        const normalized = normalizeQuestionnaireAttemptResult(response.data)
        resultItem.value = normalized

        return normalized
      } catch {
        return null
      }
    }

    async function getAttemptResult(attemptId: string) {
      const normalizedAttemptId = String(attemptId || '').trim()

      if (!normalizedAttemptId) {
        resultItem.value = createDefaultQuestionnaireAttemptResult()
        return null
      }

      try {
        const response: ApiResult = await api.get(
          `/v1/attempts/${normalizedAttemptId}/result`,
        )

        if (!response?.success) {
          throw new Error(
            response?.error?.message || 'Failed to load attempt result.',
          )
        }

        const normalized = normalizeQuestionnaireAttemptResult(response.data)
        resultItem.value = normalized

        return normalized
      } catch {
        resultItem.value = createDefaultQuestionnaireAttemptResult()
        return null
      }
    }

    return {
      item,
      currentQuestionSession,
      saveAnswerResult,
      resultItem,

      resetState,
      resetQuestionState,
      resetSaveAnswerState,
      resetResultState,

      startAttempt,
      getCurrentQuestion,
      getQuestionById,
      saveAnswer,
      submitAttempt,
      getAttemptResult,
    }
  },
)

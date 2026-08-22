import {
  createDefaultQuestionnaireAttempt,
  normalizeQuestionnaireAttempt,
  type QuestionnaireAttemptModel,
} from '~/models/questionnaire-attempt.model'

export interface AttemptQuestionOptionModel {
  id: string
  key?: string
  label: string
  scoreValue: number
  sortOrder: number
}

export interface AttemptQuestionSavedAnswerModel {
  questionId: string
  optionId: string | null
  fixedOptionKey: string | null
  labelSnapshot: string
  scoreValueSnapshot: number
}

export interface AttemptQuestionModel {
  id: string
  text: string
  description: string
  questionType: string
  questionMode: string
  imageUrl: string | null
  isRequired: boolean
  sortOrder: number
  prevQuestionId: string | null
  nextQuestionId: string | null
  options: AttemptQuestionOptionModel[]
  savedAnswer: AttemptQuestionSavedAnswerModel | null
  meta: Record<string, any>
}

export interface AttemptQuestionnaireModel {
  id: string
  title: string
  description: string
  scoringType: string
  optionsMode: string
  showResultToUser: boolean
  estimatedTimeMinutes: number
}

export interface AttemptQuestionProgressModel {
  totalQuestions: number
  answeredQuestions: number
  currentQuestionNumber: number
  isFirstQuestion: boolean
  isLastQuestion: boolean
  isComplete: boolean
}

export interface AttemptQuestionSessionModel {
  attempt: QuestionnaireAttemptModel
  questionnaire: AttemptQuestionnaireModel
  question: AttemptQuestionModel
  progress: AttemptQuestionProgressModel
}

export function createDefaultAttemptQuestionSession(): AttemptQuestionSessionModel {
  return {
    attempt: createDefaultQuestionnaireAttempt(),
    questionnaire: {
      id: '',
      title: '',
      description: '',
      scoringType: '',
      optionsMode: '',
      showResultToUser: false,
      estimatedTimeMinutes: 0,
    },
    question: {
      id: '',
      text: '',
      description: '',
      questionType: '',
      questionMode: 'text',
      imageUrl: null,
      isRequired: false,
      sortOrder: 0,
      prevQuestionId: null,
      nextQuestionId: null,
      options: [],
      savedAnswer: null,
      meta: {},
    },
    progress: {
      totalQuestions: 0,
      answeredQuestions: 0,
      currentQuestionNumber: 0,
      isFirstQuestion: true,
      isLastQuestion: false,
      isComplete: false,
    },
  }
}

export function normalizeAttemptQuestionSession(
  payload: any,
): AttemptQuestionSessionModel {
  const options = Array.isArray(payload?.question?.options)
    ? payload.question.options.map((option: any) => ({
      id: String(option?.id || '').trim(),
      key: option?.key ? String(option.key).trim() : '',
      label: String(option?.label || '').trim(),
      scoreValue: Number(option?.scoreValue || 0),
      sortOrder: Number(option?.sortOrder || 0),
    }))
    : []

  const savedAnswer = payload?.question?.savedAnswer
    ? {
      questionId: String(payload.question.savedAnswer?.questionId || '').trim(),
      optionId: payload.question.savedAnswer?.optionId
        ? String(payload.question.savedAnswer.optionId).trim()
        : null,
      fixedOptionKey: payload.question.savedAnswer?.fixedOptionKey
        ? String(payload.question.savedAnswer.fixedOptionKey).trim()
        : null,
      labelSnapshot: String(
        payload.question.savedAnswer?.labelSnapshot || '',
      ).trim(),
      scoreValueSnapshot: Number(
        payload.question.savedAnswer?.scoreValueSnapshot || 0,
      ),
    }
    : null

  return {
    attempt: normalizeQuestionnaireAttempt(payload?.attempt || {}),
    questionnaire: {
      id: String(payload?.questionnaire?.id || '').trim(),
      title: String(payload?.questionnaire?.title || '').trim(),
      description: String(payload?.questionnaire?.description || '').trim(),
      scoringType: String(payload?.questionnaire?.scoringType || '').trim(),
      optionsMode: String(payload?.questionnaire?.optionsMode || '').trim(),
      showResultToUser: Boolean(payload?.questionnaire?.showResultToUser),
      estimatedTimeMinutes: Number(
        payload?.questionnaire?.estimatedTimeMinutes || 0,
      ),
    },
    question: {
      id: String(payload?.question?.id || '').trim(),
      text: String(payload?.question?.text || '').trim(),
      description: String(payload?.question?.description || '').trim(),
      questionType: String(payload?.question?.questionType || '').trim(),
      questionMode: String(payload?.question?.questionMode || 'text').trim(),
      imageUrl: payload?.question?.imageUrl
        ? String(payload.question.imageUrl).trim()
        : null,
      isRequired: Boolean(payload?.question?.isRequired),
      sortOrder: Number(payload?.question?.sortOrder || 0),
      prevQuestionId: payload?.question?.prevQuestionId
        ? String(payload.question.prevQuestionId).trim()
        : null,
      nextQuestionId: payload?.question?.nextQuestionId
        ? String(payload.question.nextQuestionId).trim()
        : null,
      options,
      savedAnswer,
      meta:
        payload?.question?.meta && typeof payload.question.meta === 'object'
          ? payload.question.meta
          : {},
    },
    progress: {
      totalQuestions: Number(payload?.progress?.totalQuestions || 0),
      answeredQuestions: Number(payload?.progress?.answeredQuestions || 0),
      currentQuestionNumber: Number(
        payload?.progress?.currentQuestionNumber || 0,
      ),
      isFirstQuestion: Boolean(payload?.progress?.isFirstQuestion),
      isLastQuestion: Boolean(payload?.progress?.isLastQuestion),
      isComplete: Boolean(payload?.progress?.isComplete),
    },
  }
}

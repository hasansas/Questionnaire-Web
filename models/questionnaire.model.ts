/**
 * Types
 */
export const QUESTIONNAIRE_STATUSES = [
  'draft',
  'active',
  'inactive',
  'archived',
] as const

export type QuestionnaireStatus = (typeof QUESTIONNAIRE_STATUSES)[number]

export const QUESTIONNAIRE_SCORING_TYPES = [
  'fixed',
  'multi_dimension',
  'banded',
] as const

export type QuestionnaireScoringType =
  (typeof QUESTIONNAIRE_SCORING_TYPES)[number]

export const QUESTIONNAIRE_OPTIONS_MODES = [
  'fixed',
  'per_question',
] as const

export type QuestionnaireOptionsMode =
  (typeof QUESTIONNAIRE_OPTIONS_MODES)[number]

export interface QuestionnaireFixedOptionModel {
  label: string
  value: string
  scoreValue?: number | null
}

/**
 * Questionnaire Data Model
 */
export interface QuestionnaireModel {
  id: string
  code: string
  title: string
  description: string | null

  shortDescription: string | null
  instructions: string | null
  estimatedTimeMinutes: number | null
  totalQuestions: number | null
  totalDimensions: number | null
  totalBands: number | null
  totalMeanings: number | null
  category: string | null
  tags: string[] | null
  coverImageUrl: string | null

  language: string
  status: QuestionnaireStatus
  version: number
  scoringType: QuestionnaireScoringType
  showResultToUser: boolean
  optionsMode: QuestionnaireOptionsMode
  fixedOptionsJson: QuestionnaireFixedOptionModel[]

  isFeatured: boolean
  isPublic: boolean
  sortOrder: number | null

  createdAt?: Date
  updatedAt?: Date
}

/**
 * Default factory for creating a clean questionnaire object
 */
export const createDefaultQuestionnaire = (): QuestionnaireModel => ({
  id: '',
  code: '',
  title: '',
  description: null,

  shortDescription: null,
  instructions: null,
  estimatedTimeMinutes: null,
  totalQuestions: null,
  totalDimensions: null,
  totalBands: null,
  totalMeanings: null,
  category: null,
  tags: [],
  coverImageUrl: null,

  language: 'id',
  status: 'draft',
  version: 1,
  scoringType: 'fixed',
  showResultToUser: true,
  optionsMode: 'per_question',
  fixedOptionsJson: [],

  isFeatured: false,
  isPublic: false,
  sortOrder: null,

  createdAt: new Date(),
  updatedAt: new Date(),
})

/**
 * Helper — normalize partial questionnaire data into full model
 */
export function normalizeQuestionnaire(
  item?: Partial<QuestionnaireModel>
): QuestionnaireModel {
  return {
    id: item?.id ?? '',
    code: item?.code ?? '',
    title: item?.title ?? '',
    description: item?.description ?? null,

    shortDescription: item?.shortDescription ?? null,
    instructions: item?.instructions ?? null,
    estimatedTimeMinutes: item?.estimatedTimeMinutes ?? null,
    totalQuestions: item?.totalQuestions ?? null,
    totalDimensions: item?.totalDimensions ?? null,
    totalBands: item?.totalBands ?? null,
    totalMeanings: item?.totalMeanings ?? null,
    category: item?.category ?? null,
    tags: Array.isArray(item?.tags) ? item!.tags : [],
    coverImageUrl: item?.coverImageUrl ?? null,

    language: item?.language ?? 'id',
    status: item?.status ?? 'draft',
    version: item?.version ?? 1,
    scoringType: item?.scoringType ?? 'fixed',
    showResultToUser: item?.showResultToUser ?? true,
    optionsMode: item?.optionsMode ?? 'per_question',
    fixedOptionsJson: Array.isArray(item?.fixedOptionsJson)
      ? item!.fixedOptionsJson
      : [],

    isFeatured: item?.isFeatured ?? false,
    isPublic: item?.isPublic ?? false,
    sortOrder: item?.sortOrder ?? null,

    createdAt: item?.createdAt ? new Date(item.createdAt) : new Date(),
    updatedAt: item?.updatedAt ? new Date(item.updatedAt) : new Date(),
  }
}

/**
 * Normalizer (Array) — safely map list of questionnaire records
 */
export function normalizeQuestionnaires(
  items?: Partial<QuestionnaireModel>[]
): QuestionnaireModel[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeQuestionnaire(item))
}
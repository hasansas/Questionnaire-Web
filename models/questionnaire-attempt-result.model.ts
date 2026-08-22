export interface OverallMeaningModel {
  resultLabel: string
  description: string
  recommendations: string[]
}

export interface DimensionMeaningModel {
  dimensionKey: string
  dimensionLabel: string | null
  score: number
  band: string | null
  resultLabel: string | null
  description: string | null
  recommendations: string[] | null
}

export interface QuestionnaireAttemptResultModel {
  id: string
  attemptId: string
  scoringTypeSnapshot: string
  scoresJson: Record<string, number>
  bandsJson: Record<string, string>
  overallMeaning: OverallMeaningModel
  dimensionMeanings: DimensionMeaningModel[]
  computedAt: string
  createdAt: string
  updatedAt: string
}

export function createDefaultQuestionnaireAttemptResult(): QuestionnaireAttemptResultModel {
  return {
    id: '',
    attemptId: '',
    scoringTypeSnapshot: '',
    scoresJson: {},
    bandsJson: {},
    overallMeaning: {
      resultLabel: '',
      description: '',
      recommendations: [],
    },
    dimensionMeanings: [],
    computedAt: '',
    createdAt: '',
    updatedAt: '',
  }
}

function normalizeOverallMeaning(payload: any): OverallMeaningModel {
  return {
    resultLabel: String(payload?.resultLabel || '').trim(),
    description: String(payload?.description || '').trim(),
    recommendations: Array.isArray(payload?.recommendations)
      ? payload.recommendations.map((item: any) => String(item || '').trim())
      : [],
  }
}

function normalizeDimensionMeanings(payload: any): DimensionMeaningModel[] {
  if (!Array.isArray(payload)) return []

  return payload.map((item: any) => ({
    dimensionKey: String(item?.dimensionKey || '').trim(),
    dimensionLabel: item?.dimensionLabel
      ? String(item.dimensionLabel).trim()
      : null,
    score: Number(item?.score || 0),
    band: item?.band ? String(item.band).trim() : null,
    resultLabel: item?.resultLabel ? String(item.resultLabel).trim() : null,
    description: item?.description ? String(item.description).trim() : null,
    recommendations: Array.isArray(item?.recommendations)
      ? item.recommendations.map((rec: any) => String(rec || '').trim())
      : null,
  }))
}

export function normalizeQuestionnaireAttemptResult(
  payload: any,
): QuestionnaireAttemptResultModel {
  return {
    id: String(payload?.id || '').trim(),
    attemptId: String(payload?.attemptId || '').trim(),
    scoringTypeSnapshot: String(payload?.scoringTypeSnapshot || '').trim(),
    scoresJson:
      payload?.scoresJson && typeof payload.scoresJson === 'object'
        ? Object.fromEntries(
          Object.entries(payload.scoresJson).map(([key, value]) => [
            String(key).trim(),
            Number(value || 0),
          ]),
        )
        : {},
    bandsJson:
      payload?.bandsJson && typeof payload.bandsJson === 'object'
        ? Object.fromEntries(
          Object.entries(payload.bandsJson).map(([key, value]) => [
            String(key).trim(),
            String(value || '').trim(),
          ]),
        )
        : {},
    overallMeaning: normalizeOverallMeaning(payload?.overallMeaning),
    dimensionMeanings: normalizeDimensionMeanings(payload?.dimensionMeanings),
    computedAt: String(payload?.computedAt || '').trim(),
    createdAt: String(payload?.createdAt || '').trim(),
    updatedAt: String(payload?.updatedAt || '').trim(),
  }
}

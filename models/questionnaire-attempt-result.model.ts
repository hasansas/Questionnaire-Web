export interface QuestionnaireAttemptResultModel {
  id: string
  attemptId: string
  scoringTypeSnapshot: string
  scoresJson: Record<string, number>
  bandsJson: Record<string, string>
  resultLabel: string
  meaningId: string | null
  meaningSnapshot: string
  recommendationsSnapshot: string[]
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
    resultLabel: '',
    meaningId: null,
    meaningSnapshot: '',
    recommendationsSnapshot: [],
    computedAt: '',
    createdAt: '',
    updatedAt: '',
  }
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
    resultLabel: String(payload?.resultLabel || '').trim(),
    meaningId: payload?.meaningId ? String(payload.meaningId).trim() : null,
    meaningSnapshot: String(payload?.meaningSnapshot || '').trim(),
    recommendationsSnapshot: Array.isArray(payload?.recommendationsSnapshot)
      ? payload.recommendationsSnapshot.map((item: any) =>
        String(item || '').trim(),
      )
      : [],
    computedAt: String(payload?.computedAt || '').trim(),
    createdAt: String(payload?.createdAt || '').trim(),
    updatedAt: String(payload?.updatedAt || '').trim(),
  }
}

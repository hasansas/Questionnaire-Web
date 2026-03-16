export interface SaveAttemptAnswerProgressModel {
  totalQuestions: number
  answeredQuestions: number
  currentQuestionNumber: number
  isFirstQuestion: boolean
  isLastQuestion: boolean
  isComplete: boolean
}

export interface SaveAttemptAnswerResultModel {
  saved: boolean
  attemptId: string
  progress: SaveAttemptAnswerProgressModel
  currentQuestionId: string | null
  prevQuestionId: string | null
  nextQuestionId: string | null
  resumeQuestionId?: string | null
}

export function createDefaultSaveAttemptAnswerResult(): SaveAttemptAnswerResultModel {
  return {
    saved: false,
    attemptId: '',
    progress: {
      totalQuestions: 0,
      answeredQuestions: 0,
      currentQuestionNumber: 0,
      isFirstQuestion: true,
      isLastQuestion: false,
      isComplete: false,
    },
    currentQuestionId: null,
    prevQuestionId: null,
    nextQuestionId: null,
    resumeQuestionId: null,
  }
}

export function normalizeSaveAttemptAnswerResult(
  payload: any,
): SaveAttemptAnswerResultModel {
  return {
    saved: Boolean(payload?.saved),
    attemptId: String(payload?.attemptId || '').trim(),
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
    currentQuestionId: payload?.currentQuestionId
      ? String(payload.currentQuestionId).trim()
      : null,
    prevQuestionId: payload?.prevQuestionId
      ? String(payload.prevQuestionId).trim()
      : null,
    nextQuestionId: payload?.nextQuestionId
      ? String(payload.nextQuestionId).trim()
      : null,
    resumeQuestionId: payload?.resumeQuestionId
      ? String(payload.resumeQuestionId).trim()
      : null,
  }
}

export interface QuestionnaireAttemptUserInfoFieldModel {
  key: string
  value: string
}

export interface QuestionnaireAttemptUserInfoModel {
  fields: QuestionnaireAttemptUserInfoFieldModel[]
}

export interface QuestionnaireAttemptModel {
  id: string
  questionnaireId: string
  organizationId: string
  organizationQuestionnaireId: string
  status: string
  startedAt: string
  submittedAt: string | null
  userInfo: QuestionnaireAttemptUserInfoModel
  createdAt: string
  updatedAt: string
}

export function createDefaultQuestionnaireAttempt(): QuestionnaireAttemptModel {
  return {
    id: '',
    questionnaireId: '',
    organizationId: '',
    organizationQuestionnaireId: '',
    status: '',
    startedAt: '',
    submittedAt: null,
    userInfo: {
      fields: [],
    },
    createdAt: '',
    updatedAt: '',
  }
}

export function normalizeQuestionnaireAttempt(
  payload: any,
): QuestionnaireAttemptModel {
  const userInfoFields = Array.isArray(payload?.userInfo?.fields)
    ? payload.userInfo.fields.map((field: any) => ({
      key: String(field?.key || '').trim(),
      value: String(field?.value ?? ''),
    }))
    : []

  return {
    id: String(payload?.id || '').trim(),
    questionnaireId: String(payload?.questionnaireId || '').trim(),
    organizationId: String(payload?.organizationId || '').trim(),
    organizationQuestionnaireId: String(
      payload?.organizationQuestionnaireId || '',
    ).trim(),
    status: String(payload?.status || '').trim(),
    startedAt: String(payload?.startedAt || '').trim(),
    submittedAt: payload?.submittedAt
      ? String(payload.submittedAt).trim()
      : null,
    userInfo: {
      fields: userInfoFields,
    },
    createdAt: String(payload?.createdAt || '').trim(),
    updatedAt: String(payload?.updatedAt || '').trim(),
  }
}

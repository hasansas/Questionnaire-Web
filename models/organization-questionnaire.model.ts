import {
  createDefaultOrganization,
  normalizeOrganization,
  type OrganizationModel,
} from '~/models/organization.model'
import {
  createDefaultQuestionnaire,
  normalizeQuestionnaire,
  type QuestionnaireModel,
} from '~/models/questionnaire.model'

/**
 * Organization Questionnaire Assignment Data Model
 */
export interface OrganizationQuestionnaireAssignmentModel {
  id: string | null
  description: string | null
  isActive: boolean
  isPublic: boolean
  sortOrder: number | null
  metaJson: Record<string, any> | null
  shareCode: string | null
  publicSlug: string | null
  shareUrl: string | null
  publicUrl: string | null
}

/**
 * Organization Questionnaire Data Model
 */
export interface OrganizationQuestionnaireModel {
  organization: OrganizationModel
  questionnaire: QuestionnaireModel
  assignment: OrganizationQuestionnaireAssignmentModel
}

/**
 * Default factory for creating a clean organization-questionnaire-assignment object
 */
export const createDefaultOrganizationQuestionnaireAssignment =
  (): OrganizationQuestionnaireAssignmentModel => ({
    id: null,
    description: null,
    isActive: false,
    isPublic: false,
    sortOrder: null,
    metaJson: null,
    shareCode: null,
    publicSlug: null,
    shareUrl: null,
    publicUrl: null,
  })

/**
 * Default factory for creating a clean organization-questionnaire object
 */
export const createDefaultOrganizationQuestionnaire =
  (): OrganizationQuestionnaireModel => ({
    organization: createDefaultOrganization(),
    questionnaire: createDefaultQuestionnaire(),
    assignment: createDefaultOrganizationQuestionnaireAssignment(),
  })

/**
 * Helper — normalize partial organization-questionnaire-assignment data into full model
 */
export function normalizeOrganizationQuestionnaireAssignment(
  item?: Partial<OrganizationQuestionnaireAssignmentModel>
): OrganizationQuestionnaireAssignmentModel {
  return {
    id: item?.id ?? null,
    description: item?.description ?? null,
    isActive: item?.isActive ?? false,
    isPublic: item?.isPublic ?? false,
    sortOrder: item?.sortOrder ?? null,
    metaJson: item?.metaJson ?? null,
    shareCode: item?.shareCode ?? null,
    publicSlug: item?.publicSlug ?? null,
    shareUrl: item?.shareUrl ?? null,
    publicUrl: item?.publicUrl ?? null,
  }
}

/**
 * Helper — normalize partial organization-questionnaire data into full model
 */
export function normalizeOrganizationQuestionnaire(
  item?: Partial<OrganizationQuestionnaireModel>
): OrganizationQuestionnaireModel {
  return {
    organization: normalizeOrganization(item?.organization),
    questionnaire: normalizeQuestionnaire(item?.questionnaire),
    assignment: normalizeOrganizationQuestionnaireAssignment(item?.assignment),
  }
}

/**
 * Normalizer (Array) — safely map list of organization-questionnaire records
 */
export function normalizeOrganizationQuestionnaires(
  items?: Partial<OrganizationQuestionnaireModel>[]
): OrganizationQuestionnaireModel[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeOrganizationQuestionnaire(item))
}
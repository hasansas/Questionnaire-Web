import { type ProfileModel, createDefaultProfile, normalizeProfile } from './profile'

export interface ImageModel {
  name: string | null
  fileName: string | null
  url: string | null
}

export type Gender = 'male' | 'female' | null

export interface UserProfileModel {
  firstName: string | null
  lastName: string | null
  gender: Gender
  /** Prefer ISO `YYYY-MM-DD` */
  birthDate: string | null
  address: string | null
}

export interface UserPreferenceModel {
  language: string
  timezone: string
  theme: string
  dateFormat: string
  timeFormat: string
  currency: string

  notificationEmail: boolean
  notificationPush: boolean
  notificationWhatsapp: boolean

  preferencesCompleted: boolean
  tourCompleted: boolean
  onboardingStatus: string

  uiFlags: Record<string, any>
  extraMeta: Record<string, any>
}

export interface UserModel {
  id: string
  name: string
  email: string
  phoneNumber: string | null
  image: ImageModel
  profile: UserProfileModel,
  baziProfile: ProfileModel,
  preference: UserPreferenceModel
}

/**
 * Default factories
 * --------------------------------------------------------------------------
 */
export const createDefaultImage = (): ImageModel => ({
  name: null,
  fileName: null,
  url: null,
})

export const createDefaultUserProfile = (): UserProfileModel => ({
  firstName: null,
  lastName: null,
  gender: null,
  birthDate: null,
  address: null,
})

export const createDefaultPreference = (): UserPreferenceModel => ({
  language: 'en',
  timezone: 'UTC',
  theme: 'system',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24h',
  currency: 'USD',

  notificationEmail: false,
  notificationPush: false,
  notificationWhatsapp: false,

  preferencesCompleted: false,
  tourCompleted: false,
  onboardingStatus: 'idle',

  uiFlags: {},
  extraMeta: {},
})

export const createDefaultUser = (): UserModel => ({
  id: '',
  name: '',
  email: '',
  phoneNumber: '',
  image: createDefaultImage(),
  profile: createDefaultUserProfile(),
  baziProfile: createDefaultProfile(),
  preference: createDefaultPreference(),
})

/**
 * Normalizers
 * --------------------------------------------------------------------------
 */
export function normalizeImage(item?: Partial<ImageModel>): ImageModel {
  return {
    name: item?.name ?? null,
    fileName: item?.fileName ?? null,
    url: item?.url ?? null,
  }
}

function splitFullName(name?: string | null): { firstName: string | null; lastName: string | null } {
  const n = (name ?? '').trim()
  if (!n) return { firstName: null, lastName: null }
  const parts = n.split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0], lastName: null }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') || null }
}

export function normalizeUserProfile(
  item?: Partial<UserProfileModel>,
  opts?: { fallbackFullName?: string | null }
): UserProfileModel {
  const nameParts = splitFullName(opts?.fallbackFullName ?? null)
  return {
    firstName: item?.firstName ?? nameParts.firstName,
    lastName: item?.lastName ?? nameParts.lastName,
    gender: (item?.gender ?? null) as Gender,
    birthDate: item?.birthDate ?? null,
    address: item?.address ?? null,
  }
}

export function normalizePreference(item?: Partial<UserPreferenceModel>): UserPreferenceModel {
  const d = createDefaultPreference()
  return {
    language: item?.language ?? d.language,
    timezone: item?.timezone ?? d.timezone,
    theme: item?.theme ?? d.theme,
    dateFormat: item?.dateFormat ?? d.dateFormat,
    timeFormat: item?.timeFormat ?? d.timeFormat,
    currency: item?.currency ?? d.currency,

    notificationEmail: item?.notificationEmail ?? d.notificationEmail,
    notificationPush: item?.notificationPush ?? d.notificationPush,
    notificationWhatsapp: item?.notificationWhatsapp ?? d.notificationWhatsapp,

    preferencesCompleted: item?.preferencesCompleted ?? d.preferencesCompleted,
    tourCompleted: item?.tourCompleted ?? d.tourCompleted,
    onboardingStatus: item?.onboardingStatus ?? d.onboardingStatus,

    uiFlags: item?.uiFlags ?? d.uiFlags,
    extraMeta: item?.extraMeta ?? d.extraMeta,
  }
}

/**
 * Primary user normalizer
 */
export function normalizeUser(item?: Partial<UserModel>): UserModel {
  return {
    id: item?.id ?? '',
    name: item?.name ?? '',
    email: item?.email ?? '',
    phoneNumber: item?.phoneNumber ?? '',
    image: normalizeImage(item?.image),
    profile: normalizeUserProfile((item as any)?.profile, { fallbackFullName: item?.name ?? '' }),
    baziProfile: normalizeProfile((item as any)?.baziProfile),
    preference: normalizePreference((item as any)?.preference),
  }
}
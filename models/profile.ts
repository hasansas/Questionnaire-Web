/**
 * Profile data model
 */

import { createDefaultImage, normalizeImage, type ImageModel } from './user'

export interface ProfileDate {
  year: number
  month: number
  day: number
  hour?: number
  minute?: number
  second?: number
}

export interface ProfileModel {
  id?: string
  name: string
  email?: string
  phone?: string
  phoneSanitized?: string
  image?: ImageModel
  dob: Date
  timeOfBirth?: string | null
  timezone?: string
  gender?: string | null
  placeOfBirth?: string | null
  isMe?: boolean
  notes?: string | null
  createdAt?: Date
  date?: ProfileDate
}

export interface ProfileInputModel extends Omit<ProfileModel, "dob" | "createdAt"> {
  dob: string;
}

/**
 * Default factory — ensures a clean base object
 */
export const createDefaultProfile = (): ProfileModel => ({
  id: '',
  name: '',
  email: '',
  phone: '',
  phoneSanitized: '',
  image: createDefaultImage(),
  dob: new Date(),
  timeOfBirth: '00:00',
  timezone: '',
  gender: null,
  placeOfBirth: null,
  isMe: false,
  notes: null,
  createdAt: new Date(),
  date: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  },
})

/**
 * Helper — derive structured date from dob & timeOfBirth
 */
function extractProfileDate(dob: Date, timeOfBirth?: string | null): ProfileDate {
  const date = new Date(dob)
  const [hour, minute, second] = timeOfBirth ? timeOfBirth.split(':').map(Number) : []

  const base: ProfileDate = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }

  if (!isNaN(hour)) base.hour = hour
  if (!isNaN(minute)) base.minute = minute
  if (!isNaN(second)) base.second = second

  return base
}

/**
 * Normalizer — safely map partial data to full model
 */
export function normalizeProfile(item?: Partial<ProfileModel>): ProfileModel {
  const dob = item?.dob ? new Date(item.dob) : new Date()
  const timeOfBirth = item?.timeOfBirth ?? '00:00'

  return {
    id: item?.id ?? '',
    name: item?.name ?? '',
    email: item?.email ?? '',
    phone: item?.phone ?? '',
    phoneSanitized: item?.phoneSanitized ?? '',
    image: normalizeImage(item?.image),
    dob,
    date: extractProfileDate(dob, timeOfBirth),
    timeOfBirth,
    timezone: item?.timezone ?? '',
    gender: item?.gender ?? null,
    placeOfBirth: item?.placeOfBirth ?? null,
    isMe: item?.isMe ?? false,
    notes: item?.notes ?? null,
    createdAt: item?.createdAt ? new Date(item.createdAt) : new Date(),
  }
}

/**
 * Normalizer (Array) — safely map list of profiles
 */
export function normalizeProfiles(items?: Partial<ProfileModel>[]): ProfileModel[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeProfile(item))
}

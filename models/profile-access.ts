/**
 * Profile Access Model
 */

export interface ProfileAccessModel {
  code: string
  name: string
  description: string
  category: string
  orderIndex: number
  isPremium: boolean
  granted: boolean
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Input Model — used when saving or updating access info
 */
export interface ProfileAccessInputModel extends Omit<ProfileAccessModel, 'createdAt' | 'updatedAt'> { }

/**
 * Default Factory — ensures a clean base object
 */
export const createDefaultProfileAccess = (): ProfileAccessModel => ({
  code: '',
  name: '',
  description: '',
  category: '',
  orderIndex: 0,
  isPremium: false,
  granted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
})

/**
 * Normalizer — safely map partial data to full model
 */
export function normalizeProfileAccess(item?: Partial<ProfileAccessModel>): ProfileAccessModel {
  return {
    code: item?.code ?? '',
    name: item?.name ?? '',
    description: item?.description ?? '',
    category: item?.category ?? '',
    orderIndex: item?.orderIndex ?? 0,
    isPremium: item?.isPremium ?? false,
    granted: item?.granted ?? false
  }
}

/**
 * Normalizer (Array) — safely map list of profile accesses
 */
export function normalizeProfileAccesses(items?: Partial<ProfileAccessModel>[]): ProfileAccessModel[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeProfileAccess(item))
}

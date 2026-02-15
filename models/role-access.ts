import { type FeatureModel } from '~/models/feature'

// Access Data Model
export interface AccessModel {
  id: string
  accessType: string
  feature: FeatureModel
  createdAt?: Date
  updatedAt?: Date
}

// Default factory for creating a clean access object
export const createDefaultAccess = (): AccessModel => ({
  id: '',
  accessType: 'blocked',
  feature: {
    id: '',
    code: '',
    name: '',
    category: '',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
})

// Helper — normalize partial access data into full model
export function normalizeAccess(item?: Partial<AccessModel>): AccessModel {
  return {
    id: item?.id ?? '',
    accessType: item?.accessType ?? 'blocked',
    feature: {
      id: item?.feature?.id ?? '',
      code: item?.feature?.code ?? '',
      name: item?.feature?.name ?? '',
      category: item?.feature?.category ?? '',
    },
    createdAt: item?.createdAt ? new Date(item.createdAt) : new Date(),
    updatedAt: item?.updatedAt ? new Date(item.updatedAt) : new Date(),
  }
}

// Normalizer (Array) — safely map list of access records
export function normalizeAccesses(items?: Partial<AccessModel>[]): AccessModel[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeAccess(item))
}

/**
 * Organization Data Model
*/
export type OrganizationStatus = 'active' | 'inactive' | 'draft' | 'archived'
export interface OrganizationModel {
  id: string
  code: string
  name: string

  type: string
  category: string
  subCategory?: string | null

  email?: string | null
  phone?: string | null
  phoneSanitized?: string | null
  image?: string | null
  website?: string | null
  description?: string | null

  countryId?: number | null
  stateId?: number | null
  cityId?: number | null
  subdistrict?: string | null
  postalCode?: string | null
  address?: string | null

  status: OrganizationStatus
  settingsJson?: Record<string, any> | null

  createdAt?: Date
  updatedAt?: Date
}

/**
 * Default factory for creating a clean organization object
 */
export const createDefaultOrganization = (): OrganizationModel => ({
  id: '',
  code: '',
  name: '',

  type: '',
  category: '',
  subCategory: null,

  email: null,
  phone: null,
  phoneSanitized: null,
  image: null,
  website: null,
  description: null,

  countryId: null,
  stateId: null,
  cityId: null,
  subdistrict: null,
  postalCode: null,
  address: null,

  status: 'inactive' as OrganizationStatus,
  settingsJson: null,

  createdAt: new Date(),
  updatedAt: new Date(),
})

/**
 * Helper — normalize partial organization data into full model
 */
export function normalizeOrganization(
  item?: Partial<OrganizationModel>
): OrganizationModel {
  return {
    id: item?.id ?? '',
    code: item?.code ?? '',
    name: item?.name ?? '',

    type: item?.type ?? '',
    category: item?.category ?? '',
    subCategory: item?.subCategory ?? null,

    email: item?.email ?? null,
    phone: item?.phone ?? null,
    phoneSanitized: item?.phoneSanitized ?? null,
    image: item?.image ?? null,
    website: item?.website ?? null,
    description: item?.description ?? null,

    countryId: item?.countryId ?? null,
    stateId: item?.stateId ?? null,
    cityId: item?.cityId ?? null,
    subdistrict: item?.subdistrict ?? null,
    postalCode: item?.postalCode ?? null,
    address: item?.address ?? null,

    status: item?.status ?? ('inactive' as OrganizationStatus),
    settingsJson: item?.settingsJson ?? null,

    createdAt: item?.createdAt ? new Date(item.createdAt) : new Date(),
    updatedAt: item?.updatedAt ? new Date(item.updatedAt) : new Date(),
  }
}

/**
 * Normalizer (Array) — safely map list of organization records
 */
export function normalizeOrganizations(
  items?: Partial<OrganizationModel>[]
): OrganizationModel[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeOrganization(item))
}
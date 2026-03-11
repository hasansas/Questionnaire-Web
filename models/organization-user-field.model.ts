export const USER_FIELD_TYPES = [
  'text',
  'email',
  'number',
  'textarea',
  'select',
  'radio',
  'date',
] as const

export type UserFieldType = (typeof USER_FIELD_TYPES)[number]

export interface OrganizationUserFieldOptionModel {
  label: string
  value: string
}

export interface OrganizationUserFieldModel {
  id: string
  key: string
  label: string
  fieldType: UserFieldType
  validationJson: Record<string, any> | null
  optionsJson: OrganizationUserFieldOptionModel[] | null
  isActive: boolean
}

export interface OrganizationUserFieldConfigModel {
  organizationId: string
  isActive: boolean
  version: number
  fields: OrganizationUserFieldModel[]

  createdAt?: Date
  updatedAt?: Date
}

export const createDefaultOrganizationUserFieldOption =
  (): OrganizationUserFieldOptionModel => ({
    label: '',
    value: '',
  })

export const createDefaultOrganizationUserField =
  (): OrganizationUserFieldModel => ({
    id: '',
    key: '',
    label: '',
    fieldType: 'text',
    validationJson: null,
    optionsJson: null,
    isActive: true,
  })

export const createDefaultOrganizationUserFieldConfig =
  (): OrganizationUserFieldConfigModel => ({
    organizationId: '',
    isActive: false,
    version: 1,
    fields: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  })

export function normalizeOrganizationUserFieldOption(
  item?: Partial<OrganizationUserFieldOptionModel>
): OrganizationUserFieldOptionModel {
  return {
    label: item?.label ?? '',
    value: item?.value ?? '',
  }
}

export function normalizeOrganizationUserField(
  item?: Partial<OrganizationUserFieldModel>
): OrganizationUserFieldModel {
  return {
    id: item?.id ?? '',
    key: item?.key ?? '',
    label: item?.label ?? '',
    fieldType: item?.fieldType ?? 'text',
    validationJson: item?.validationJson ?? null,
    optionsJson: Array.isArray(item?.optionsJson)
      ? item!.optionsJson.map((opt) => normalizeOrganizationUserFieldOption(opt))
      : null,
    isActive: item?.isActive ?? true,
  }
}

export function normalizeOrganizationUserFields(
  items?: Partial<OrganizationUserFieldModel>[]
): OrganizationUserFieldModel[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeOrganizationUserField(item))
}

export function normalizeOrganizationUserFieldConfig(
  item?: Partial<OrganizationUserFieldConfigModel>
): OrganizationUserFieldConfigModel {
  return {
    organizationId: item?.organizationId ?? '',
    isActive: item?.isActive ?? false,
    version: item?.version ?? 1,
    fields: normalizeOrganizationUserFields(item?.fields),
    createdAt: item?.createdAt ? new Date(item.createdAt) : new Date(),
    updatedAt: item?.updatedAt ? new Date(item.updatedAt) : new Date(),
  }
}

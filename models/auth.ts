/**
 * Authentication data models
 */

export interface AuthModel {
  id: string
  role: string
  organizationId: string | null
  token: string
  refreshToken: string
  isLoggedIn: boolean
}

/**
 * Default factory — ensures clean base object
 */
export const createDefaultAuth = (): AuthModel => ({
  id: '',
  role: '',
  organizationId: null,
  token: '',
  refreshToken: '',
  isLoggedIn: false,
})

/**
 * Normalizer — safely map partial data to full model
 */
export function normalizeAuth(item?: Partial<AuthModel>): AuthModel {
  return {
    id: item?.id ?? '',
    role: item?.role ?? '',
    organizationId: item?.organizationId ?? null,
    token: item?.token ?? '',
    refreshToken: item?.refreshToken ?? '',
    isLoggedIn: item?.isLoggedIn ?? false,
  }
}

// types/api.d.ts
export { };

declare global {
  /**
   * Standard shape for all API responses (success or error)
   */
  interface ApiSuccess<T = any> {
    success: true
    code: number
    data: T
  }

  interface ApiError {
    success: false
    code: number
    error: any
  }

  type ApiResult<T = any> = ApiSuccess<T> | ApiError
}



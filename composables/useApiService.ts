// /composables/useApiService.ts

import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '~/stores/auth'

// /**
//  * Standard shape for all API responses (success or error)
//  */
// export interface ApiSuccess<T = any> {
//   success: true
//   code: number
//   data: T
// }

// export interface ApiError {
//   success: false
//   code: number
//   error: any
// }

// export type ApiResult<T = any> = ApiSuccess<T> | ApiError

/**
 * Provides standardized HTTP methods for API calls using $axios.
 * All interceptor and token logic are handled globally in /plugins/axios.ts.
 */
export function useApiService() {
  const { $axios } = useNuxtApp()
  const auth = useAuthStore()

  /**
   * Core request handler for all HTTP methods.
   * Automatically attaches headers, body, and query params.
   */
  async function request<T = any>(
    method: AxiosRequestConfig['method'],
    url: string,
    payload?: any,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResult<T>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        method,
        url,
        ...config,
      }

      // // Attach Authorization token if available
      // if (auth.token) {
      //   axiosConfig.headers = {
      //     ...(axiosConfig.headers || {}),
      //     Authorization: `Bearer ${auth.token}`,
      //   }
      // }

      // Attach data for POST/PUT/PATCH, or params for GET
      const m = method!.toLowerCase()
      if (['post', 'put', 'patch'].includes(m) && payload !== undefined) {
        axiosConfig.data = payload
      } else if (m === 'get' && payload !== undefined) {
        axiosConfig.params = payload
      }

      const response: AxiosResponse<T> = await $axios.request<T>(axiosConfig)

      return {
        success: true,
        code: response.status,
        data: (response.data as any)?.data ?? response.data,
      }
    } catch (error: any) {
      const code = error.response?.status || 500
      const errorData = error.response?.data || error.message || 'Unknown error'
      return {
        success: false,
        code,
        error: errorData,
      }
    }
  }

  // Shorthand helpers for common HTTP methods
  return {
    get: <T = any>(url: string, params?: any, config?: AxiosRequestConfig) => request<T>('get', url, params, config),
    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>('post', url, data, config),
    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>('put', url, data, config),
    patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>('patch', url, data, config),
    delete: <T = any>(url: string, config?: AxiosRequestConfig) => request<T>('delete', url, undefined, config),
  }
}


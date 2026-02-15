import { defineStore } from 'pinia'
import { useResourceStore } from '~/composables/useResourceStore'
import { normalizeProduct, normalizeProducts, type ProductModel } from '~/models/product'

export const useProductStore = defineStore('products', () => {
  const apiEndpoint = '/v1/products'

  return useResourceStore<ProductModel>({
    endpoint: apiEndpoint,
    normalizedArray: normalizeProducts,
    normalizedJson: normalizeProduct,
  })
})

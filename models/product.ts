import { type FeatureModel } from '~/models/feature'

// Feature Model
export interface FeatureItemModel extends FeatureModel {
  isPremium: boolean
  localeJson: Record<string, string>
}

// Product Feature Model
export interface ProductFeatureModel {
  id: string
  includedType: string
  feature: FeatureItemModel
}

// Price Model
export interface PriceModel {
  id: string
  price: string
  currency: string
  actualPrice: string
  billingCycle: string
  duration?: string | null
  isActive: boolean
  validFrom?: Date | null
  validTo?: Date | null
}

// Product Model
export interface ProductModel {
  id: string
  code: string
  name: string
  type: string
  description: string
  isActive: boolean
  createdAt: Date
  productFeatures: ProductFeatureModel[]
  prices: PriceModel[]
}

// Default factory for creating a clean product object
export const createDefaultProduct = (): ProductModel => ({
  id: '',
  code: '',
  name: '',
  type: '',
  description: '',
  isActive: true,
  createdAt: new Date(),
  productFeatures: [],
  prices: [],
})

// Helper — normalize partial product data into full model
export function normalizeProduct(item?: Partial<ProductModel>): ProductModel {
  return {
    id: item?.id ?? '',
    code: item?.code ?? '',
    name: item?.name ?? '',
    type: item?.type ?? '',
    description: item?.description ?? '',
    isActive: item?.isActive ?? true,
    createdAt: item?.createdAt ? new Date(item.createdAt) : new Date(),
    productFeatures: item?.productFeatures ? normalizeProductFeatures(item.productFeatures) : [],
    prices: item?.prices ? normalizePrices(item.prices) : [],
  }
}

// Normalize Product Features
export function normalizeProductFeatures(features: Partial<ProductFeatureModel>[]): ProductFeatureModel[] {
  return features.map((feature) => ({
    id: feature?.id ?? '',
    includedType: feature?.includedType ?? 'included',
    feature: {
      id: feature?.feature?.id ?? '',
      code: feature?.feature?.code ?? '',
      name: feature?.feature?.name ?? '',
      category: feature?.feature?.category ?? '',
      isPremium: feature?.feature?.isPremium ?? false,
      localeJson: feature?.feature?.localeJson ?? {},
    },
  }))
}

// Normalize Prices
export function normalizePrices(prices: Partial<PriceModel>[]): PriceModel[] {
  return prices.map((price) => ({
    id: price?.id ?? '',
    price: price?.price ?? '0.00',
    currency: price?.currency ?? 'USD',
    actualPrice: price?.actualPrice ?? '0.00',
    billingCycle: price?.billingCycle ?? 'one_time',
    duration: price?.duration ?? null,
    isActive: price?.isActive ?? true,
    validFrom: price?.validFrom ? new Date(price.validFrom) : null,
    validTo: price?.validTo ? new Date(price.validTo) : null,
  }))
}

// Normalizer (Array) — safely map list of products
export function normalizeProducts(items?: Partial<ProductModel>[]): ProductModel[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeProduct(item))
}

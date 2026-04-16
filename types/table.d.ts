// types/table.d.ts
export { }

declare global {
  type SbTableColumn<T = any> = {
    title?: string
    key: string
    sortable?: boolean
    align?: 'start' | 'center' | 'end'
    width?: string | number

    cellType?: 'text' | 'chip' | 'date' | 'avatar'

    chip?: {
      label?: (item: T) => string
      color?: string | ((item: T) => string)
      variant?: 'tonal' | 'outlined' | 'flat' | 'text'
      size?: 'x-small' | 'small' | 'default'
    }

    date?: {
      format?: 'date' | 'datetime'
      locale?: string
    }

    avatar?: {
      icon?: string
      image?: (item: T) => string | null | undefined
      text?: (item: T) => string
      color?: string | ((item: T) => string)
    }
  }
}

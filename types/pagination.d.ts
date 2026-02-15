// types/pagination.d.ts

export { };

declare global {
  interface Pagination {
    total: number
    lastPage: number | null
    perPage: number
    prevPage: number | null
    currentPage: number
    nextPage: number | null
  }

  export interface PaginatedResponse<T> {
    rows: T[]
    pagination: Pagination
  }

  export interface PaginatedData<T> {
    rows: T[][]
    pagination: Pagination
  }

}

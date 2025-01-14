
interface RequestResult<T = unknown> {
  code: number
  message: string
  data: T
  traceId: string
}

interface PaginationData<T = unknown> {
  total: number
  pageSize: number
  current: number
  list: T[]
}

interface PaginationResult<T = unknown> extends RequestResult {
  data: PaginationData<T>
}

interface PaginationParams {
  orderField?: string
  orderMode?: string
  page?: number
  pageSize?: number
}

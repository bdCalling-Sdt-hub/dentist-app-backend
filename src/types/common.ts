export type IGenericResponse<T> = {
  meta: {
    limit: number
    page: number
    totalPage: number
    total: number
  }
  data: T
}

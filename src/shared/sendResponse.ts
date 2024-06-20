import { Response } from 'express'

type IData<T> = {
  statusCode: number
  success: boolean
  message?: string
  pagination?: {
    page: number
    limit: number
    totalPage: number
    total: number
  }
  unreadNotifications?: number
  data?: T
}

const sendResponse = <T>(res: Response, data: IData<T>) => {
  const responseData = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    pagination: data.pagination,
    unreadNotifications: data.unreadNotifications,
    data: data.data,
  }

  res.status(data.statusCode).json(responseData)
}

export default sendResponse

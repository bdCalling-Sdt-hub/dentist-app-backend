import { Response } from 'express'

type IData<T> = {
  statusCode: number
  success: boolean
  message?: string
  data?: T
}

const sendResponse = <T>(res: Response, data: IData<T>) => {
  const responseData = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    data: data.data,
  }

  res.status(data.statusCode).json(responseData)
}

export default sendResponse

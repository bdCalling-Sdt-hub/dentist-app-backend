import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { SmartCheckServer } from './smartCheck.service'

const createSmartCheck = catchAsync(async (req: Request, res: Response) => {
  let smartCheckImage = ''
  if (
    req.files &&
    'smartCheckImage' in req.files &&
    req.files.smartCheckImage[0]
  ) {
    smartCheckImage = `/images/${req.files.smartCheckImage[0].filename}`
  }
  const smartCheckData = {
    ...req.body,
    smartCheckImage,
  }
  console.log(smartCheckData)
  const result = await SmartCheckServer.createSmartCheckToDB(smartCheckData)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Smart check create successfully',
    data: result,
  })
})

const getAllSmartCheck = catchAsync(async (req: Request, res: Response) => {
  const result = await SmartCheckServer.getSmartCheckFromDB()

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Smart check retrieved successfully',
    data: result,
  })
})

const updateSmartCheck = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  let smartCheckImage
  if (
    req.files &&
    'smartCheckImage' in req.files &&
    req.files.smartCheckImage[0]
  ) {
    smartCheckImage = `/images/${req.files.smartCheckImage[0].filename}`
  }
  const smartCheckData = {
    ...req.body,
    smartCheckImage,
  }
  const result = await SmartCheckServer.updateSmartCheckToDB(id, smartCheckData)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Smart check data updated successfully',
    data: result,
  })
})

const deleteSmartCheck = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await SmartCheckServer.deleteSmartCheckToDB(id)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Smart check delete successfully',
    data: result,
  })
})

export const SmartCheckController = {
  createSmartCheck,
  getAllSmartCheck,
  updateSmartCheck,
  deleteSmartCheck,
}

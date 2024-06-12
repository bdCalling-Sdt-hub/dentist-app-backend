import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { PackageService } from './package.service'

const createPackage = catchAsync(async (req: Request, res: Response) => {
  const { ...packageData } = req.body
  const result = await PackageService.createPackageToDB(packageData)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Package created successfully',
    data: result,
  })
})

const getPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.getPackageFromDB()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Package retrieved successfully',
    data: result,
  })
})

const updatePackage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const { ...packageData } = req.body
  const result = await PackageService.updatePackageToDB(id, packageData)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Package updated successfully',
    data: result,
  })
})

export const PackageController = {
  createPackage,
  getPackage,
  updatePackage,
}

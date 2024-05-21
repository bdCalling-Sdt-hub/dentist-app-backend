import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { BannerService } from './banner.service'

const createBanner = catchAsync(async (req: Request, res: Response) => {
  let bannerImage = ''
  if (req.files && 'bannerImage' in req.files && req.files.bannerImage[0]) {
    bannerImage = `/images/${req.files.bannerImage[0].filename}`
  }
  const data = {
    ...req.body,
    bannerImage,
  }

  const result = await BannerService.createBannerToDB(data)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Banner create successfully',
    data: result,
  })
})

const getAllBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await BannerService.getAllBannerFromDB()

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Banner retrieved successfully',
    data: result,
  })
})

const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  let bannerImage
  if (req.files && 'bannerImage' in req.files && req.files.bannerImage[0]) {
    bannerImage = `/images/${req.files.bannerImage[0].filename}`
  }
  const data = {
    ...req.body,
    bannerImage,
  }

  const result = await BannerService.updateBannerToDB(id, data)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Banner updated successfully',
    data: result,
  })
})

const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await BannerService.deleteBannerToDB(id)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Banner deleted successfully',
    data: result,
  })
})

export const BannerController = {
  createBanner,
  getAllBanner,
  updateBanner,
  deleteBanner,
}

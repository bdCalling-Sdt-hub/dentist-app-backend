import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { OfferService } from './offer.service'

const createOffer = catchAsync(async (req: Request, res: Response) => {
  let offerImage = ''
  if (req.files && 'offerImage' in req.files && req.files.offerImage[0]) {
    offerImage = `/images/${req.files.offerImage[0].filename}`
  }
  const offerData = {
    ...req.body,
    offerImage,
  }
  const result = await OfferService.createOfferToDB(offerData)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Offer create successfully',
    data: result,
  })
})

const getAllOffer = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferService.getOfferFromDB()

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Offer retrieved successfully',
    data: result,
  })
})

const getSingleOffer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await OfferService.getSingleOfferFromDB(id)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Offer retrieved successfully',
    data: result,
  })
})

const updateOffer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  let offerImage
  if (req.files && 'offerImage' in req.files && req.files.offerImage[0]) {
    offerImage = `/images/${req.files.offerImage[0].filename}`
  }
  const offerData = {
    ...req.body,
    offerImage,
  }
  const result = await OfferService.updateOfferToDB(id, offerData)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Offer updated successfully',
    data: result,
  })
})

const deleteOffer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await OfferService.deleteOfferToDB(id)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Offer delete successfully',
    data: result,
  })
})

export const OfferController = {
  createOffer,
  getAllOffer,
  updateOffer,
  deleteOffer,
  getSingleOffer,
}

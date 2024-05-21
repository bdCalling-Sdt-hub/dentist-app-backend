import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import unlinkFile from '../../../util/unlinkFile'
import { IOffer } from './offer.interface'
import { Offer } from './offer.model'

const createOfferToDB = async (payload: IOffer) => {
  const createOffer = await Offer.create(payload)
  if (!createOffer) {
    throw new ApiError(StatusCodes.OK, 'Failed to create offer')
  }
  return createOffer
}

const getOfferFromDB = async (): Promise<IOffer[]> => {
  const createOffer = await Offer.find()
  return createOffer
}

const updateOfferToDB = async (
  id: string,
  payload: IOffer,
): Promise<IOffer | null> => {
  const isExistOffer = await Offer.findById(id)
  if (!isExistOffer) {
    throw new ApiError(StatusCodes.OK, "Offer doesn't exist!")
  }

  //delete file from local
  if (payload.offerImage) {
    unlinkFile(isExistOffer.offerImage)
  }

  const updatedOffer = await Offer.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  return updatedOffer
}

const deleteOfferToDB = async (id: string) => {
  const isExistOffer = await Offer.findById(id)
  if (!isExistOffer) {
    throw new ApiError(StatusCodes.OK, "Offer doesn't exist!")
  }
  //delete file from local
  unlinkFile(isExistOffer.offerImage)

  const deleteOffer = await Offer.findByIdAndDelete(id)
  return deleteOffer
}

export const OfferService = {
  createOfferToDB,
  getOfferFromDB,
  updateOfferToDB,
  deleteOfferToDB,
}

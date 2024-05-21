import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import unlinkFile from '../../../util/unlinkFile'
import { IBanner } from './banner.interface'
import { Banner } from './banner.model'

const createBannerToDB = async (payload: IBanner): Promise<IBanner> => {
  const createBanner = await Banner.create(payload)
  if (!createBanner) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create banner')
  }
  return createBanner
}

const getAllBannerFromDB = async (): Promise<IBanner[]> => {
  const result = await Banner.find()
  return result
}

const updateBannerToDB = async (
  id: string,
  payload: IBanner,
): Promise<IBanner | null> => {
  const isExistBanner = await Banner.findById(id)
  if (!isExistBanner) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Banner doesn't exist")
  }
  if (payload.bannerImage) {
    unlinkFile(isExistBanner.bannerImage)
  }

  const updatedBanner = await Banner.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })

  return updatedBanner
}

const deleteBannerToDB = async (id: string): Promise<IBanner | null> => {
  const isExistBanner = await Banner.findById(id)
  if (!isExistBanner) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Banner doesn't exist")
  }

  //file delete here
  unlinkFile(isExistBanner.bannerImage)

  const deleteFile = await Banner.findByIdAndDelete(id)
  return deleteFile
}

export const BannerService = {
  createBannerToDB,
  getAllBannerFromDB,
  updateBannerToDB,
  deleteBannerToDB,
}

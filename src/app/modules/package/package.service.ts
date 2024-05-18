import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IPackage } from './package.interface'
import { Package } from './package.model'

const createPackageToDB = async (payload: IPackage): Promise<IPackage> => {
  const createPackage = await Package.create(payload)
  if (!createPackage) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create package')
  }
  return createPackage
}

const getPackageFromDB = async (): Promise<IPackage | null> => {
  const result = await Package.findOne()
  return result
}

export const PackageService = {
  createPackageToDB,
  getPackageFromDB,
}

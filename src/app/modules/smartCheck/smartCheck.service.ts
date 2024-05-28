import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import unlinkFile from '../../../util/unlinkFile'
import { ISmartCheck } from './smartCheck.interface'
import { SmartCheck } from './smartCheck.model'

const createSmartCheckToDB = async (payload: ISmartCheck) => {
  const createSmartCheck = await SmartCheck.create(payload)
  if (!createSmartCheck) {
    throw new ApiError(StatusCodes.OK, 'Failed to create smart check')
  }
  return createSmartCheck
}

const getSmartCheckFromDB = async (): Promise<ISmartCheck[]> => {
  const result = await SmartCheck.find()
  return result
}

const updateSmartCheckToDB = async (
  id: string,
  payload: Partial<ISmartCheck>,
): Promise<ISmartCheck | null> => {
  const isExistSmartCheck = await SmartCheck.findById(id)
  if (!isExistSmartCheck) {
    throw new ApiError(StatusCodes.OK, "Smart check data doesn't exist!")
  }

  //delete file from local
  if (payload.smartCheckImage) {
    unlinkFile(isExistSmartCheck.smartCheckImage)
  }

  const updatedSmartCheck = await SmartCheck.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  )
  return updatedSmartCheck
}

const deleteSmartCheckToDB = async (id: string) => {
  const isExistSmartCheck = await SmartCheck.findById(id)
  if (!isExistSmartCheck) {
    throw new ApiError(StatusCodes.OK, "Smart check data doesn't exist!")
  }
  //delete file from local
  unlinkFile(isExistSmartCheck.smartCheckImage)

  const deleteSmartCheck = await SmartCheck.findByIdAndDelete(id)
  return deleteSmartCheck
}

export const SmartCheckServer = {
  createSmartCheckToDB,
  getSmartCheckFromDB,
  updateSmartCheckToDB,
  deleteSmartCheckToDB,
}

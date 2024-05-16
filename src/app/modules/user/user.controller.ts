import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { UserService } from './user.service'

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body
  const result = await UserService.createPatientToDB(userData)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Patient accounted created successfully',
    data: result,
  })
})

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const result = await UserService.getProfileFromDB(user)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile data retrieved successfully',
    data: result,
  })
})

export const UserController = {
  createPatient,
  getProfile,
}

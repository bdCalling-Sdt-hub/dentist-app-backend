import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { AuthService } from './auth.service'

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body

  const result = await AuthService.loginUserFromDB(loginData)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User login successfully',
    data: result.createToken,
  })
})

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const { ...passwordData } = req.body

  await AuthService.changePasswordToDB(user, passwordData)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Password change successfully',
  })
})

export const AuthController = { loginUser, changePassword }

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

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const email = req.body

  await AuthService.forgetPasswordToDB(email)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Please check your email, we send a Otp!',
  })
})

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const { ...verifyOtpData } = req.body

  const result = await AuthService.verifyOtpToDB(verifyOtpData)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message:
      'Verification Successful: Please securely store and utilize this code for reset password',
    data: result,
  })
})

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization
  const { ...passwordData } = req.body

  await AuthService.resetPasswordToDB(token!, passwordData)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Password reset successfully',
  })
})

//user password change
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

export const AuthController = {
  loginUser,
  changePassword,
  forgetPassword,
  verifyOtp,
  resetPassword,
}

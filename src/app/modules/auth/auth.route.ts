import express from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { AuthController } from './auth.controller'
import { AuthValidation } from './auth.validation'
const router = express.Router()

router.post(
  '/login',
  validateRequest(AuthValidation.createLoginZodSchema),
  AuthController.loginUser,
)

router.post(
  '/forget-password',
  validateRequest(AuthValidation.createForgetPasswordZodSchema),
  AuthController.forgetPassword,
)

router.post(
  '/verify-otp',
  validateRequest(AuthValidation.createVerifyOtpZodSchema),
  AuthController.verifyOtp,
)

router.post(
  '/change-password',
  auth(USER_TYPE.PATIENT, USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  validateRequest(AuthValidation.createChangePasswordZodSchema),
  AuthController.changePassword,
)

export const AuthRoutes = router

import express from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { UserController } from './user.controller'
import { UserValidation } from './user.validation'
const router = express.Router()

router.post(
  '/create-patient',
  validateRequest(UserValidation.createPatientZodSchema),
  UserController.createPatient,
)

router.get(
  '/profile',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
  UserController.getProfile,
)

export const UserRoutes = router

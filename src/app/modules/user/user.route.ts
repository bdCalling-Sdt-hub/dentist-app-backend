import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { UserController } from './user.controller'
import { UserValidation } from './user.validation'
const router = express.Router()

router.get(
  '/create-patient',
  validateRequest(UserValidation.createPatientZodSchema),
  UserController.createPatient,
)

export const UserRoutes = router

import express from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import fileHandler from '../../middlewares/fileHandler'
import { PatientController } from './patient.controller'
const router = express.Router()

router.patch(
  '/profile-update',
  auth(USER_TYPE.PATIENT),
  fileHandler(),
  PatientController.patientUpdate,
)

export const PatientRoutes = router

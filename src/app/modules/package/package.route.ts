import express from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { PackageController } from './package.controller'
import { PackageValidation } from './package.validation'
const router = express.Router()

router.patch(
  '/:id',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  validateRequest(PackageValidation.updatePackageZodSchema),
  PackageController.updatePackage,
)

router
  .route('/')
  .post(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    validateRequest(PackageValidation.createPackageZodSchema),
    PackageController.createPackage,
  )

  .get(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
    PackageController.getPackage,
  )

export const PackageRoutes = router

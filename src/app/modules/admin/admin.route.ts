import express from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import fileHandler from '../../middlewares/fileHandler'
import { AdminController } from './admin.controller'
const router = express.Router()

router.patch(
  '/profile-update',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  fileHandler(),
  AdminController.adminUpdate,
)

export const AdminRoutes = router

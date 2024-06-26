import express from 'express';
import { USER_TYPE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

//patient management
router.post(
  '/create-patient',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  validateRequest(UserValidation.createPatientZodSchema),
  UserController.createPatient,
);

router.post(
  '/send-mail',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  validateRequest(UserValidation.sendEmail),
  UserController.sendEmail,
);

router.get(
  '/patient',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  UserController.getAllPatient,
);

//admin management
router.post(
  '/create-admin',
  auth(USER_TYPE.SUPER_ADMIN),
  validateRequest(UserValidation.createAdminZodSchema),
  UserController.createAdmin,
);

router.get('/admin', auth(USER_TYPE.SUPER_ADMIN), UserController.getAllAdmin);

router.delete(
  '/admin/:id',
  auth(USER_TYPE.SUPER_ADMIN),
  UserController.deleteAdmin,
);

//profile
router.get(
  '/profile',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
  UserController.getProfile,
);

//analytic
router.get(
  '/analysis',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
  UserController.userAnalysis,
);

//delete user
router.patch(
  '/delete/:id',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  UserController.deleteUser,
);

//admin management
router.post(
  '/create-super-admin',
  validateRequest(UserValidation.createAdminZodSchema),
  UserController.createSuperAdmin,
);

export const UserRoutes = router;

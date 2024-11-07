import express from 'express';
import { USER_TYPE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { NotificationController } from './notification.controller';
const router = express.Router();

router.patch(
  '/read-notifications',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
  NotificationController.readNotifications,
);

router
  .route('/all-delete')
  .delete(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
    NotificationController.allDeleteNotification,
  );

router.get(
  '/admin-notifications',
  auth(USER_TYPE.ADMIN, USER_TYPE.SUPER_ADMIN),
  NotificationController.getAllAdminNotification,
);

router
  .route('/:id')
  .delete(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
    NotificationController.deleteNotification,
  );

router.get(
  '/',
  auth(USER_TYPE.ADMIN, USER_TYPE.SUPER_ADMIN, USER_TYPE.PATIENT),
  NotificationController.getAllNotification,
);

export const NotificationRoutes = router;

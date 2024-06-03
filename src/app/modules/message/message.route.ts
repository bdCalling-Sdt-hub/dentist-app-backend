import express from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import fileHandler from '../../middlewares/fileHandler'
import { MessageController } from './message.controller'
const router = express.Router()

router.post(
  '/send-message',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
  fileHandler(),
  MessageController.sendMessage,
)

router.get(
  '/chatId/:chatId',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
  MessageController.getMessages,
)

export const MessageRoutes = router

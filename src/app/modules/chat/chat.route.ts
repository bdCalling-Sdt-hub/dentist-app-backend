import express from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import { ChatController } from './chat.controller'
const router = express.Router()

router.post('/', auth(USER_TYPE.PATIENT), ChatController.createChat)
router.get(
  '/patient-chat-list',
  auth(USER_TYPE.ADMIN, USER_TYPE.SUPER_ADMIN),
  ChatController.patientChatList,
)

export const ChatRoutes = router

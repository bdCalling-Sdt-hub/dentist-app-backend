import express from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { ContactController } from './contact.controller'
import { ContactValidation } from './contact.validation'

const router = express.Router()

router.patch(
  '/:id',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  validateRequest(ContactValidation.updateContactZodSchema),
  ContactController.updateContact,
)

router
  .route('/')
  .post(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    validateRequest(ContactValidation.createContactZodSchema),
    ContactController.createContact,
  )
  .get(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
    ContactController.getContact,
  )

export const ContactRoutes = router

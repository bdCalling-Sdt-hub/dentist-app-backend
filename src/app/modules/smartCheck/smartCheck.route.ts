import express, { NextFunction, Request, Response } from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import fileHandler from '../../middlewares/fileHandler'

import { SmartCheckController } from './smartCheck.controller'
import { SmartCheckValidation } from './smartCheck.validation'
const router = express.Router()

router.post(
  '/create-smart-check',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  fileHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SmartCheckValidation.createSmartCheckZodSchema.parse(
      JSON.parse(req.body.data),
    )
    return SmartCheckController.createSmartCheck(req, res, next)
  },
)

router
  .route('/:id')
  .patch(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    fileHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = SmartCheckValidation.updateSmartCheckZodSchema.parse(
          JSON.parse(req.body.data),
        )
      }
      return SmartCheckController.updateSmartCheck(req, res, next)
    },
  )
  .delete(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    SmartCheckController.deleteSmartCheck,
  )

router.get(
  '/',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
  SmartCheckController.getAllSmartCheck,
)

export const SmartCheckRoutes = router

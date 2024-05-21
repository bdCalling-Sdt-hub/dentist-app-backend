import express, { NextFunction, Request, Response } from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import fileHandler from '../../middlewares/fileHandler'
import { OfferController } from './offer.controller'
import { OfferValidation } from './offer.validation'
const router = express.Router()

router.post(
  '/create-offer',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  fileHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = OfferValidation.createOfferZodSchema.parse(
      JSON.parse(req.body.data),
    )
    return OfferController.createOffer(req, res, next)
  },
)

router
  .route('/:id')
  .patch(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    fileHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = OfferValidation.updateOfferZodSchema.parse(
          JSON.parse(req.body.data),
        )
      }
      return OfferController.updateOffer(req, res, next)
    },
  )
  .delete(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    OfferController.deleteOffer,
  )

router.get(
  '/',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
  OfferController.getAllOffer,
)

export const OfferRoutes = router

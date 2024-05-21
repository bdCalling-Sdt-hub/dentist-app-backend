import express, { NextFunction, Request, Response } from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import fileHandler from '../../middlewares/fileHandler'
import { BannerController } from './banner.controller'
import { BannerValidation } from './banner.validation'
const router = express.Router()

router.post(
  '/create-banner',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  fileHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = BannerValidation.createBannerZodSchema.parse(
      JSON.parse(req.body.data),
    )
    return BannerController.createBanner(req, res, next)
  },
)

router
  .route('/:id')
  .patch(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    fileHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = BannerValidation.updateBannerZodSchema.parse(
          JSON.parse(req.body.data),
        )
      }
      return BannerController.updateBanner(req, res, next)
    },
  )
  .delete(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    BannerController.deleteBanner,
  )

router.get(
  '/',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
  BannerController.getAllBanner,
)

export const BannerRoutes = router

import express, { NextFunction, Request, Response } from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import fileHandler from '../../middlewares/fileHandler'
import { ArticleCategoryController } from './articleCategory.controller'
import { ArticleCategoryValidation } from './articleCategory.validation'
const router = express.Router()

router.post(
  '/create-article-category',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  fileHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = ArticleCategoryValidation.createArticleCategoryZodSchema.parse(
      JSON.parse(req.body.data),
    )
    return ArticleCategoryController.createArticleCategory(req, res, next)
  },
)

router
  .route('/:id')
  .patch(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    fileHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body =
          ArticleCategoryValidation.updateArticleCategoryZodSchema.parse(
            JSON.parse(req.body.data),
          )
      }
      return ArticleCategoryController.updateArticleCategory(req, res, next)
    },
  )

router.get(
  '/',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
  ArticleCategoryController.getAllArticleCategory,
)

export const ArticleCategoryRoutes = router

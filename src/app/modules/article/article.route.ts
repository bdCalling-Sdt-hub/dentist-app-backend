import express, { NextFunction, Request, Response } from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import fileHandler from '../../middlewares/fileHandler'
import { ArticleController } from './article.controller'
import { ArticleValidation } from './article.validation'
const router = express.Router()

router.post(
  '/create-article',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  fileHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = ArticleValidation.createArticleZodSchema.parse(
      JSON.parse(req.body.data),
    )
    return ArticleController.createArticle(req, res, next)
  },
)

router
  .route('/:id')
  .delete(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    ArticleController.deleteArticle,
  )

router.get(
  '/',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
  ArticleController.getAllArticle,
)

export const ArticleRoutes = router

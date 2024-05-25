import express from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import fileHandler from '../../middlewares/fileHandler'
import { ArticleCategoryController } from './articleCategory.controller'
const router = express.Router()

router.post(
  '/create-article-category',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  fileHandler(),
  ArticleCategoryController.createArticleCategory,
)

router
  .route('/:id')
  .patch(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    fileHandler(),
    ArticleCategoryController.updateArticleCategory,
  )

router.get(
  '/',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.PATIENT),
  ArticleCategoryController.getAllArticleCategory,
)

export const ArticleCategoryRoutes = router

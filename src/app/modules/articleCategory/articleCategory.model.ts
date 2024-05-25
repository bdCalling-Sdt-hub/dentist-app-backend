import { StatusCodes } from 'http-status-codes'
import { model, Schema } from 'mongoose'
import ApiError from '../../../errors/ApiError'
import {
  ArticleCategoryModel,
  IArticleCategory,
} from './articleCategory.interface'

const articleCategorySchema = new Schema<
  IArticleCategory,
  ArticleCategoryModel
>(
  {
    articleCategoryName: {
      type: String,
      enum: [
        'Patient Care',
        'Dental Condition',
        'Skin Condition',
        'Medical Condition',
      ],
      required: true,
    },
    articleCategoryImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

articleCategorySchema.pre('save', async function (next) {
  const isExist = await ArticleCategory.findOne({
    articleCategoryName: this.articleCategoryName,
  })
  if (isExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Article category already exist!',
    )
  }
  next()
})

export const ArticleCategory = model<IArticleCategory, ArticleCategoryModel>(
  'ArticleCategory',
  articleCategorySchema,
)

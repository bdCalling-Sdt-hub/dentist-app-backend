import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import unlinkFile from '../../../util/unlinkFile'
import { IArticleCategory } from './articleCategory.interface'
import { ArticleCategory } from './articleCategory.model'

const createArticleCategoryToDB = async (
  payload: IArticleCategory,
): Promise<IArticleCategory> => {
  const result = await ArticleCategory.create(payload)
  return result
}

const getAllArticleCategoryFromDB = async (): Promise<IArticleCategory[]> => {
  const result = await ArticleCategory.find()
  return result
}

const updateArticleCategoryToDB = async (
  id: string,
  payload: IArticleCategory,
): Promise<IArticleCategory | null> => {
  const isExist = await ArticleCategory.findOne({ _id: id })
  if (!isExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Article category doesn't exist!",
    )
  }
  //delete file from local
  if (payload.articleCategoryImage) {
    unlinkFile(isExist.articleCategoryImage)
  }

  const result = await ArticleCategory.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })

  return result
}

export const ArticleCategoryService = {
  createArticleCategoryToDB,
  getAllArticleCategoryFromDB,
  updateArticleCategoryToDB,
}

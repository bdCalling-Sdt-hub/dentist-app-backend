import { StatusCodes } from 'http-status-codes'
import { SortOrder } from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../types/common'
import { IPaginationOptions } from '../../../types/pagination'
import unlinkFile from '../../../util/unlinkFile'
import { IArticle, IArticleFilterOptions } from './article.interface'
import { Article } from './article.model'

const createArticleToDB = async (payload: IArticle): Promise<IArticle> => {
  const createArticle = await Article.create(payload)

  if (!createArticle) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to created article')
  }

  return createArticle
}

const getAllArticleFromDB = async (
  paginationOptions: IPaginationOptions,
  filterOptions: IArticleFilterOptions,
): Promise<IGenericResponse<IArticle[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions)
  const { search } = filterOptions

  let searchConditions = {}
  if (search) {
    searchConditions = {
      $or: [
        {
          articleName: {
            $regex: search,
            $options: 'i',
          },
        },
      ],
    }
  }

  const sortConditions: { [key: string]: SortOrder } = {}
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }

  const result = await Article.find(searchConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  const total = await Article.countDocuments(searchConditions)
  const totalPage = Math.ceil(total / limit)

  return {
    meta: {
      page,
      limit,
      totalPage,
      total,
    },
    data: result,
  }
}

const deleteArticleToDB = async (id: string): Promise<IArticle | null> => {
  const isExist = await Article.findById(id)
  if (!isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Article doesn't exist!")
  }
  //unlink file from local
  for (let image of isExist.articleSlider) {
    unlinkFile(image)
  }
  unlinkFile(isExist.buttonImage)

  const result = await Article.findByIdAndDelete(id)
  return result
}

export const ArticleService = {
  createArticleToDB,
  getAllArticleFromDB,
  deleteArticleToDB,
}

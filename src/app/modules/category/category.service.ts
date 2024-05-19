import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { ICategory } from './category.interface'
import { Category } from './category.model'

const createCategoryToDB = async (payload: ICategory) => {
  const createCategory = await Category.create(payload)
  if (createCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create category')
  }

  return createCategory
}
const getCategoriesFromDB = async (): Promise<ICategory[]> => {
  const result = await Category.find()
  return result
}

const updateCategoryToDB = async (id: string, payload: ICategory) => {
  const updateCategory = await Category.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  if (updateCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category doesn't exist")
  }

  return updateCategory
}

const deleteCategoryToDB = async (id: string): Promise<ICategory | null> => {
  const deleteCategory = await Category.findByIdAndDelete(id)
  if (deleteCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category doesn't exist")
  }
  return deleteCategory
}

export const CategoryService = {
  createCategoryToDB,
  getCategoriesFromDB,
  updateCategoryToDB,
  deleteCategoryToDB,
}

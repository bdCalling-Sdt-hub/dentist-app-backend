import { Model } from 'mongoose'

export type IArticleCategory = {
  articleCategoryName:
    | 'Patient Care'
    | 'Dental Condition'
    | 'Skin Condition'
    | 'Medical Condition'
  articleCategoryImage: string
}

export type ArticleCategoryModel = Model<
  IArticleCategory,
  Record<string, unknown>
>

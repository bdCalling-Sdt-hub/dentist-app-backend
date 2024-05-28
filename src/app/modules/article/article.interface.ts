import { Model } from 'mongoose'

export type IArticle = {
  articleName: string
  patientCategory?: string
  articleCategory: string
  buttonImage: string
  articleSlider: string[]
  articleDetails: string
}

export type ArticleModel = Model<IArticle, Record<string, unknown>>

export type IArticleFilterOptions = {
  search?: string
}

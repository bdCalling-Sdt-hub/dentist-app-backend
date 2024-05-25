import { Model } from 'mongoose'

export type IArticle = {
  articleName: string
  buttonImage: string
  articleSlider: string[]
  articleDetails: string
}

export type ArticleModel = Model<IArticle, Record<string, unknown>>

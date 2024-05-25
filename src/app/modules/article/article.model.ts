import { model, Schema } from 'mongoose'
import { ArticleModel, IArticle } from './article.interface'

const articleSchema = new Schema<IArticle, ArticleModel>(
  {
    articleName: {
      type: String,
      required: true,
    },
    buttonImage: {
      type: String,
      required: true,
    },
    articleSlider: {
      type: [String],
      required: true,
    },
    articleDetails: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export const Article = model<IArticle, ArticleModel>('Article', articleSchema)

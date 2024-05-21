import { model, Schema } from 'mongoose'
import { BannerModel, IBanner } from './banner.interface'

const bannerSchema = new Schema<IBanner, BannerModel>(
  {
    bannerTitle: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export const Banner = model<IBanner, BannerModel>('Banner', bannerSchema)

import { Model } from 'mongoose'

export type IBanner = {
  bannerImage: string
  bannerTitle: string
}

export type BannerModel = Model<IBanner, Record<string, unknown>>

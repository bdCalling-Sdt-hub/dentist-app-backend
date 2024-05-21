import { Model } from 'mongoose'

export type IOffer = {
  offerImage: string
  offerTitle: string
  offerDetails: string[]
}

export type OfferModel = Model<IOffer, Record<string, unknown>>

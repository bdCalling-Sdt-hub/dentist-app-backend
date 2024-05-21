import { model, Schema } from 'mongoose'
import { IOffer, OfferModel } from './offer.interface'

const offerSchema = new Schema<IOffer, OfferModel>({
  offerTitle: {
    type: String,
    required: true,
  },
  offerImage: {
    type: String,
    required: true,
  },
  offerDetails: {
    type: [String],
    required: true,
  },
})

export const Offer = model<IOffer, OfferModel>('Offer', offerSchema)

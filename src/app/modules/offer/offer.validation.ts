import { z } from 'zod'

const createOfferZodSchema = z.object({
  offerTitle: z.string({ required_error: 'Offer title is required' }),
  offerDetails: z
    .array(z.string(), {
      required_error: 'Package details must be an array of strings',
    })
    .nonempty({ message: "Offer details can't be an empty" }),
})

const updateOfferZodSchema = z.object({
  offerTitle: z.string().optional(),
  offerDetails: z.array(z.string()).optional(),
})

export const OfferValidation = {
  createOfferZodSchema,
  updateOfferZodSchema,
}

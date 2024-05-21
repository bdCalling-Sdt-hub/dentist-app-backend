import { z } from 'zod'

const createBannerZodSchema = z.object({
  bannerTitle: z.string({ required_error: 'Banner title is required' }),
})

const updateBannerZodSchema = z.object({
  bannerTitle: z.string().optional(),
})

export const BannerValidation = {
  createBannerZodSchema,
  updateBannerZodSchema,
}

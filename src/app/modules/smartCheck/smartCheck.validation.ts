import { z } from 'zod'

const createSmartCheckZodSchema = z.object({
  smartCheckLink: z.string({ required_error: 'Smart link is required' }),
})

const updateSmartCheckZodSchema = z.object({
  smartCheckLink: z.string().optional(),
})

export const SmartCheckValidation = {
  createSmartCheckZodSchema,
  updateSmartCheckZodSchema,
}

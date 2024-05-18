import { z } from 'zod'

const createContactZodSchema = z.object({
  body: z.object({
    contact: z.string({ required_error: 'Contact number is required' }),
  }),
})

const updateContactZodSchema = z.object({
  body: z.object({
    contact: z.string().optional(),
  }),
})

export const ContactValidation = {
  createContactZodSchema,
  updateContactZodSchema,
}

import { z } from 'zod'

const createArticleZodSchema = z.object({
  articleName: z.string({ required_error: 'Article name is required' }),
  patientCategory: z.string().optional(),
  articleCategory: z.string({ required_error: 'Article category is required' }),
  articleDetails: z.string({ required_error: 'Article Details is required' }),
})

const updateArticleZodSchema = z.object({
  articleName: z.string().optional(),
  patientCategory: z.string().optional(),
  articleCategory: z.string().optional(),
  articleDetails: z.string().optional(),
})

export const ArticleValidation = {
  createArticleZodSchema,
  updateArticleZodSchema,
}

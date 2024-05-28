import { z } from 'zod'

const createArticleCategoryZodSchema = z.object({
  articleCategoryName: z.string({
    required_error: 'Article category name is required',
  }),
})

const updateArticleCategoryZodSchema = z.object({
  articleCategoryName: z.string().optional(),
})

export const ArticleCategoryValidation = {
  createArticleCategoryZodSchema,
  updateArticleCategoryZodSchema,
}

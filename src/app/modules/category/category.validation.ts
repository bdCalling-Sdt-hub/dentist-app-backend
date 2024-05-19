import { z } from 'zod'

const createCategoryZodSchema = z.object({
  body: z.object({
    categoryName: z.string({ required_error: 'Category name is required' }),
  }),
})

const updateCategoryZodSchema = z.object({
  body: z.object({
    categoryName: z.string().optional(),
  }),
})

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
}

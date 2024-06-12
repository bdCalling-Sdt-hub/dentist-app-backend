import { z } from 'zod'

const createPackageZodSchema = z.object({
  body: z.object({
    packageName: z.string({ required_error: 'Package name is required' }),
    packageDetails: z
      .array(z.string(), {
        required_error: 'Package details must be an array of strings',
      })
      .nonempty({ message: 'Package details cannot be empty' }),
  }),
})

const updatePackageZodSchema = z.object({
  body: z.object({
    packageName: z.string().optional(),
    packageDetails: z.array(z.string()).optional(),
  }),
})

export const PackageValidation = {
  createPackageZodSchema,
  updatePackageZodSchema,
}

import { z } from 'zod'

const createLoginZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    pin: z.string().optional(),
    password: z.string({ required_error: 'Password is required' }),
  }),
})

const createForgetPasswordZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
  }),
})

const createVerifyOtpZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    otp: z.string({ required_error: 'Otp is required' }),
  }),
})

const createChangePasswordZodSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current password is required',
    }),
    newPassword: z.string({ required_error: 'New password is required' }),
    confirmPassword: z.string({
      required_error: 'Confirm password is required',
    }),
  }),
})

const createResetPasswordZodSchema = z.object({
  body: z.object({
    newPassword: z.string({ required_error: 'New password is required' }),
    confirmPassword: z.string({
      required_error: 'Confirm password is required',
    }),
  }),
})

export const AuthValidation = {
  createLoginZodSchema,
  createChangePasswordZodSchema,
  createForgetPasswordZodSchema,
  createVerifyOtpZodSchema,
  createResetPasswordZodSchema,
}

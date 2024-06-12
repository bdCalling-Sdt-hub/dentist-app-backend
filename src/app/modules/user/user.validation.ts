import { z } from 'zod'
import { gender } from '../../../shared/constant'

const createPatientZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    contactNo: z.string({ required_error: 'Contact Number is required' }),
    age: z.number({ required_error: 'Age is required' }),
    dateOfBirth: z.string({ required_error: 'Date of Birth is required' }),
    gender: z.enum([...gender] as [string, ...string[]], {
      required_error: 'Gender is required',
    }),
    plan: z.string({ required_error: 'Plan is required' }),
    category: z.string({ required_error: 'Category is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
    pin: z.string().optional(),
    profile: z.string().optional(),
    status: z.enum(['active', 'delete']).optional(),
  }),
})

const createAdminZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    contactNo: z.string().optional(),
    age: z.number().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum([...gender] as [string, ...string[]]).optional(),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
    pin: z.string().optional(),
    profile: z.string().optional(),
    status: z.enum(['active', 'delete']).optional(),
  }),
})

const sendEmail = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
})

export const UserValidation = {
  createPatientZodSchema,
  createAdminZodSchema,
  sendEmail,
}

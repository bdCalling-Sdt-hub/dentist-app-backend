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
    pin: z.string({ required_error: 'Pin is required' }),
    profile: z.string().optional(),
    status: z.enum(['active', 'delete']).optional(),
  }),
})

export const UserValidation = { createPatientZodSchema }

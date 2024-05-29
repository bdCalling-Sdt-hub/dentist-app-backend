import { Model, Types } from 'mongoose'
import { IAdmin } from '../admin/admin.interface'
import { IPatient } from './../patient/patient.interface'

export type IUser = {
  email: string
  password: string
  role: string
  pin?: string
  patient?: Types.ObjectId | IPatient
  admin?: Types.ObjectId | IAdmin
  status?: 'active' | 'delete'
  authentication?: {
    isResetPassword: boolean
    oneTimeCode: string
    expiresAt: Date
  }
}

export type UserModel = {
  isUserExistById(id: string): any
  isUserExistByEmail(email: string): any
  isMatchPassword(password: string, hashPassword: string): Promise<boolean>
} & Model<IUser>

export type IForgetPassword = {
  email: string
}

export type IVerifyOtp = {
  email: string
  otp: string
}

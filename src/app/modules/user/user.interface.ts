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
}

export type UserModel = {
  isUserExist(id: string): any
  isMatchPassword(password: string, hashPassword: string): Promise<boolean>
} & Model<IUser>

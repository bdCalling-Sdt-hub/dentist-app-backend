import { Model, Types } from 'mongoose'

export type IUser = {
  email: string
  password: string
  role: string
  pin: string
  patient?: Types.ObjectId
  status?: 'active' | 'delete'
}

export type UserModel = {
  isUserExist(id: string): any
  isMatchPassword(password: string, hashPassword: string): Promise<boolean>
} & Model<IUser>

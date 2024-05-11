import { Model } from 'mongoose'

export type IUser = {
  email: string
  password: string
  pin: string
  status: 'active' | 'delete'
}

export type UserModel = {} & Model<IUser>

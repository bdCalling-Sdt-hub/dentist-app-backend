import { Model, Types } from 'mongoose'

export type IRsetToken = {
  user: Types.ObjectId
  token: string
  expiresAt: Date
}

export type ResetTokenModel = {
  isTokenExist(token: string): any
  isTokenExpire(token: string): boolean
} & Model<IRsetToken>

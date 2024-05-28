import { Model } from 'mongoose'

export type ISmartCheck = {
  smartCheckLink: string
  smartCheckImage: string
}

export type SmartCheckModel = Model<ISmartCheck, Record<string, unknown>>

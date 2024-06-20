import { Model } from 'mongoose'

export type INotification = {
  message: string
  type: 'offer' | 'chat'
  role: 'patient' | 'admin'
  image?: string
}

export type NotificationModel = Model<INotification, Record<string, unknown>>

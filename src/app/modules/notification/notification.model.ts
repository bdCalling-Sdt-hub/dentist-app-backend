import { model, Schema } from 'mongoose'
import { INotification, NotificationModel } from './notification.interface'

const notificationSchema = new Schema<INotification, NotificationModel>(
  {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['offer', 'chat'],
    },
    role: {
      type: String,
      enum: ['patient', 'admin'],
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
)

export const Notification = model<INotification, NotificationModel>(
  'Notification',
  notificationSchema,
)

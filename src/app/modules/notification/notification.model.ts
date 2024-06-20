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
      enum: ['offer', 'chat', 'article'],
    },
    role: {
      type: String,
      enum: ['patient', 'admin'],
    },
    image: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export const Notification = model<INotification, NotificationModel>(
  'Notification',
  notificationSchema,
)

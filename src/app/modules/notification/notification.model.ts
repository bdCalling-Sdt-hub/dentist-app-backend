import { model, Schema } from 'mongoose';
import { INotification, NotificationModel } from './notification.interface';

const notificationSchema = new Schema<INotification, NotificationModel>(
  {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['offer', 'chat', 'article', 'profile', 'reset'],
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
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    token: {
      type: String,
    },
    chatId: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Notification = model<INotification, NotificationModel>(
  'Notification',
  notificationSchema,
);

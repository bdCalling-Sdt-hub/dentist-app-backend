import { Model } from 'mongoose';

export type INotification = {
  message: string;
  type: 'offer' | 'chat' | 'article' | 'profile';
  role: 'patient' | 'admin';
  image?: string;
  read: boolean;
};

export type NotificationModel = Model<INotification, Record<string, unknown>>;

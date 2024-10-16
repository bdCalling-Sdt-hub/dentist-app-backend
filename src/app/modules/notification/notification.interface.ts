import { Model } from 'mongoose';

export type INotification = {
  message: string;
  type: 'offer' | 'chat' | 'article' | 'profile' | 'reset';
  role: 'patient' | 'admin';
  image?: string;
  chatId?: string;
  read: boolean;
  token?: string;
};

export type NotificationModel = Model<INotification, Record<string, unknown>>;

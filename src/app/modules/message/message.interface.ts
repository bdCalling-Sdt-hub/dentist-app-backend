import { Types } from 'mongoose';

export type IMessage = {
  chatId: Types.ObjectId;
  sender: 'patient' | 'support';
  image?: string;
  text?: string;
  messageType: 'text' | 'image' | 'audio' | 'video' | 'both';
};

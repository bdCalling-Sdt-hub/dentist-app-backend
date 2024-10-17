import { Types } from 'mongoose';

export type IChat = {
  participants: Types.ObjectId;
  lastMessage: string;
  lastMessageTime: Date;
};

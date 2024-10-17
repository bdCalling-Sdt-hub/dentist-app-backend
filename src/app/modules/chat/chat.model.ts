import { model, Schema } from 'mongoose';
import { IChat } from './chat.interface';

const chatSchema = new Schema<IChat>(
  {
    participants: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    lastMessage: {
      type: String,
      default: 'You have a new message',
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const Chat = model<IChat>('Chat', chatSchema);

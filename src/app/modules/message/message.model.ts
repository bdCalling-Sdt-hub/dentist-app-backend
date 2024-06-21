import { model, Schema } from 'mongoose';
import { IMessage } from './message.interface';

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    sender: {
      type: String,
      enum: ['patient', 'support'],
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'audio', 'video', 'both'],
    },
  },
  { timestamps: true },
);

export const Message = model<IMessage>('Message', messageSchema);

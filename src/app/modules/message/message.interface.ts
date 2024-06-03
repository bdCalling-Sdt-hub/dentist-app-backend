import { Types } from 'mongoose'

export type IMessage = {
  chatId: Types.ObjectId
  sender: 'patient' | 'admin'
  image: string
  text: string
  messageType: 'text' | 'image' | 'audio' | 'video' | 'both'
}

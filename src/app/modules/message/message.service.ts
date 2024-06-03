import { Message } from './message.model'

const sendMessageToDB = async (payload: any) => {
  const result = await Message.create(payload)

  //message
  //@ts-ignore
  const socketIo = global.io
  if (socketIo) {
    socketIo.emit(`message::${payload.chatId}`, result)
  }

  return result
}

const getMessagesFromDB = async (chatId: string) => {
  const result = await Message.find({ chatId })
  return result
}

export const MessageService = {
  getMessagesFromDB,
  sendMessageToDB,
}

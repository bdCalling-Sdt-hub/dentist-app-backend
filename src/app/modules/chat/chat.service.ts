import { JwtPayload } from 'jsonwebtoken'
import { Notification } from '../notification/notification.model'
import { Chat } from './chat.model'

const createChatToDB = async (user: JwtPayload) => {
  let result
  const isExistParticipant = await Chat.findOne({ participants: user.id })
  result = isExistParticipant

  if (!isExistParticipant) {
    result = await Chat.create({ participants: user.id })

    //notification create
    //@ts-ignore
    const socketIo = global.io
    const createNotification = await Notification.create({
      message: 'A patient wants to contact you for help.',
      role: 'admin',
      type: 'chat',
    })

    if (socketIo) {
      socketIo.emit('admin-notifications', createNotification)
    }
  }

  return result
}

const patientChatListFromDB = async () => {
  const chat = await Chat.find().populate({
    path: 'participants',
    populate: [{ path: 'patient' }],
  })
  return chat
}

export const ChatService = {
  createChatToDB,
  patientChatListFromDB,
}

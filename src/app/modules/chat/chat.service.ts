import { JwtPayload } from 'jsonwebtoken'
import { Chat } from './chat.model'

const createChatToDB = async (user: JwtPayload) => {
  let result
  const isExistParticipant = await Chat.findOne({ participants: user.id })
  result = isExistParticipant

  if (!isExistParticipant) {
    result = await Chat.create({ participants: user.id })
  }

  return result
}

const patientChatListFromDB = async () => {
  const chat = await Chat.find()
  return chat
}

export const ChatService = {
  createChatToDB,
  patientChatListFromDB,
}

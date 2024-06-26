import { paginationHelper } from '../../../helpers/paginationHelper'
import { IPaginationOptions } from '../../../types/pagination'
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

const getMessagesFromDB = async (
  chatId: string,
  paginationOptions: IPaginationOptions,
) => {
  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions)

  // const sortCondition: { [key: string]: SortOrder } = {}
  // if (sortBy && sortOrder) {
  //   sortCondition[sortBy] = sortOrder
  // }

  // const result = await Message.find({ chatId }).skip(skip).limit(limit)
  // const total = await Message.countDocuments({ chatId })
  // const totalPage = Math.ceil(total / limit)

  const result = await Message.find({ chatId })

  // return {
  //   meta: {
  //     page,
  //     limit,
  //     totalPage,
  //     total,
  //   },
  //   data: result,
  // }
  return result
}

export const MessageService = {
  getMessagesFromDB,
  sendMessageToDB,
}

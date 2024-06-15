import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import { paginationFields } from '../../../shared/constant'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { fileType } from '../../../util/fileType'
import { MessageService } from './message.service'

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const data = req.body
  const messageData = {
    chatId: data.chatId,
    sender: user.role,
    text: data.text,
    image: '',
    messageType: 'text',
  }

  if (req.files && 'image' in req.files && req.files.image[0]) {
    messageData.image = `/images/${req.files.image[0].filename}`
    messageData.messageType = fileType(req.files.image[0].mimetype)
  }

  if (
    data.text !== '' &&
    req.files &&
    'image' in req.files &&
    req.files.image[0]
  ) {
    messageData.messageType = 'both'
  }

  const result = await MessageService.sendMessageToDB(messageData)
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Message send successfully',
    data: result,
  })
})

const getMessages = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields)
  const chatId = req.params.chatId
  const result = await MessageService.getMessagesFromDB(
    chatId,
    paginationOptions,
  )
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Message retrieved successfully',
    // pagination: result.meta,
    data: result,
  })
})

export const MessageController = {
  sendMessage,
  getMessages,
}

import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { ChatService } from './chat.service'

const createChat = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const result = await ChatService.createChatToDB(user)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Chat created successfully',
    data: result,
  })
})

const patientChatList = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatService.patientChatListFromDB()

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Patient chat list retrieved successfully',
    data: result,
  })
})

export const ChatController = {
  createChat,
  patientChatList,
}

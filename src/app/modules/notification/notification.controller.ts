import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { NotificationService } from './notification.service'

const getAllNotification = catchAsync(async (req: Request, res: Response) => {
  const role = req.user.role
  const result = await NotificationService.getAllNotificationFromDB(role)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Notification retrieved successfully',
    data: result,
  })
})

export const NotificationController = { getAllNotification }

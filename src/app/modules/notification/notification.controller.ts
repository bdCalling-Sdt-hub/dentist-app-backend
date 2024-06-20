import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { paginationFields } from '../../../shared/constant';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { NotificationService } from './notification.service';

const getAllNotification = catchAsync(async (req: Request, res: Response) => {
  const role = req.user.role;
  const paginationOptions = pick(req.query, paginationFields);
  const result = await NotificationService.getAllNotificationFromDB(
    role,
    paginationOptions,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Notification retrieved successfully',
    pagination: result.meta,
    unreadNotifications: result.unreadNotifications,
    data: result.data,
  });
});

const readNotifications = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.readNotificationsToDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Notification read successfully',
    data: result,
  });
});

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const id = req.params.id;
  const result = await NotificationService.deleteNotificationToDB(id, user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Notification deleted successfully',
    data: result,
  });
});

export const NotificationController = {
  getAllNotification,
  deleteNotification,
  readNotifications,
};

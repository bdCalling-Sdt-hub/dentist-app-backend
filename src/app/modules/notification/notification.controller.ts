import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { paginationFields } from '../../../shared/constant';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { NotificationService } from './notification.service';

const getAllNotification = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const paginationOptions = pick(req.query, paginationFields);
  const result = await NotificationService.getAllNotificationFromDB(
    user,
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
  const user = req.user.id;
  const id = req.params.id;
  const result = await NotificationService.deleteNotificationToDB(user, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Notification deleted successfully',
    data: result,
  });
});

const allDeleteNotification = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user.id;
    await NotificationService.allDeleteNotificationToDB(user);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'All Notification deleted successfully',
    });
  },
);

export const NotificationController = {
  getAllNotification,
  deleteNotification,
  readNotifications,
  allDeleteNotification,
};

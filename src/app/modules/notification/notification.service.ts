import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../types/pagination';
import { Notification } from './notification.model';

const getAllNotificationFromDB = async (
  role: string,
  paginationOptions: IPaginationOptions,
) => {
  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const result = await Notification.find({ role: { $eq: role } })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments({ role: { $eq: role } });
  const totalPage = Math.ceil(total / limit);

  const unreadNotifications = await Notification.countDocuments({
    read: false,
    role: { $eq: role },
  });

  return {
    meta: {
      limit,
      page,
      totalPage,
      total,
    },
    unreadNotifications,
    data: result,
  };
};

const readNotificationsToDB = async () => {
  const result = await Notification.updateMany({ $set: { read: true } });
  return result;
};

const deleteNotificationToDB = async (id: string, user: JwtPayload) => {
  const isExistNotification = await Notification.findById(id);
  if (isExistNotification?.role !== user.role) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You do not have permission to delete this notification.',
    );
  }
  const result = await Notification.findByIdAndDelete(id);
  return result;
};

export const NotificationService = {
  getAllNotificationFromDB,
  deleteNotificationToDB,
  readNotificationsToDB,
};

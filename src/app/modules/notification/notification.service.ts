import { StatusCodes } from 'http-status-codes';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../types/pagination';
import { Notification } from './notification.model';

const getAllNotificationFromDB = async (
  role: string,
  paginationOptions: IPaginationOptions,
) => {
  const getRole = role === 'super_admin' ? 'admin' : role;

  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const result = await Notification.find({ role: { $eq: getRole } })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments({ role: { $eq: getRole } });
  const totalPage = Math.ceil(total / limit);

  const unreadNotifications = await Notification.countDocuments({
    read: false,
    role: { $eq: getRole },
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

const deleteNotificationToDB = async (id: string) => {
  const isExistNotification = await Notification.findById(id);
  if (!isExistNotification) {
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

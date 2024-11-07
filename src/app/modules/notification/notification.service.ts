import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../types/pagination';
import { User } from '../user/user.model';
import { Notification } from './notification.model';

const getAllNotificationFromDB = async (
  user: JwtPayload,
  paginationOptions: IPaginationOptions,
) => {
  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const result = await Notification.find({ user: user.id })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments({ user: user.id });
  const totalPage = Math.ceil(total / limit);

  const unreadNotifications = await Notification.countDocuments({
    read: false,
    user: user.id,
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

const deleteNotificationToDB = async (user: string, id: string) => {
  const isExistUser = await User.findById(user);
  if (!isExistUser) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You do not have permission to delete this notification.',
    );
  }
  const result = await Notification.findByIdAndDelete(id);
  return result;
};

const allDeleteNotificationToDB = async (user: string) => {
  await Notification.deleteMany({ user });
};

export const NotificationService = {
  getAllNotificationFromDB,
  deleteNotificationToDB,
  readNotificationsToDB,
  allDeleteNotificationToDB,
};

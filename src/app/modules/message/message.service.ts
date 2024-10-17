import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { firebaseHelper } from '../../../helpers/firebaseHelper';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../types/pagination';
import { Chat } from '../chat/chat.model';
import { Notification } from '../notification/notification.model';
import { User } from '../user/user.model';
import { Message } from './message.model';

const sendMessageToDB = async (payload: any) => {
  const result = await Message.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to send message');
  }
  const chatId = await Chat.findById(result.toObject().chatId);
  const user = await User.findById(chatId?.participants);

  //update message time
  const updateChatList = await Chat.findByIdAndUpdate(
    payload.chatId,
    {
      lastMessage: payload.text,
      lastMessageTime: result.createdAt as any,
    },
    { new: true },
  );

  //push notifications
  if (payload.sender !== 'patient') {
    if (user?.deviceToken) {
      const message = {
        notification: {
          title: 'New Message Received',
          body: result.toObject().text,
        },
        token: user?.deviceToken,
      };
      //firebase
      firebaseHelper.sendPushNotification(message);
    }
  }

  //message
  //@ts-ignore
  const socketIo = global.io;
  if (socketIo) {
    socketIo.emit(`message::${payload.chatId}`, result);
    socketIo.emit('chat-list-update', updateChatList);
  }

  //notification
  if (payload.sender !== 'support') {
    //@ts-ignore
    const socketIO = global.io;
    const createNotification = await Notification.create({
      message: `Someone send you message, ${payload.text}`,
      type: 'chat',
      role: 'admin',
      chatId: payload.chatId,
    });

    if (socketIO) {
      socketIO.emit('admin-notifications', createNotification);
    }
  }

  return result;
};

const getMessagesFromDB = async (
  chatId: string,
  paginationOptions: IPaginationOptions,
) => {
  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  // const sortCondition: { [key: string]: SortOrder } = {}
  // if (sortBy && sortOrder) {
  //   sortCondition[sortBy] = sortOrder
  // }

  // const result = await Message.find({ chatId }).skip(skip).limit(limit)
  // const total = await Message.countDocuments({ chatId })
  // const totalPage = Math.ceil(total / limit)

  const result = await Message.find({ chatId });

  // return {
  //   meta: {
  //     page,
  //     limit,
  //     totalPage,
  //     total,
  //   },
  //   data: result,
  // }
  return result;
};

export const MessageService = {
  getMessagesFromDB,
  sendMessageToDB,
};

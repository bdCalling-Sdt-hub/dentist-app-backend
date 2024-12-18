import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { firebaseHelper } from '../../../helpers/firebaseHelper';
import unlinkFile from '../../../util/unlinkFile';
import { Notification } from '../notification/notification.model';
import { User } from '../user/user.model';
import { IOffer } from './offer.interface';
import { Offer } from './offer.model';

const createOfferToDB = async (payload: IOffer) => {
  const createOffer = await Offer.create(payload);
  if (!createOffer) {
    throw new ApiError(StatusCodes.OK, 'Failed to create offer');
  }
  const users = await User.find({
    deviceToken: { $ne: null },
    status: 'active',
  });

  //notification create
  //@ts-ignore
  const socketIo = global.io;
  if (socketIo) {
    users.map(async user => {
      const createNotification = await Notification.create({
        message: 'A new offer has been created for you.',
        role: 'patient',
        user: user._id,
        type: 'offer',
        image: payload.offerImage,
      });

      socketIo.emit(`patient-notifications::${user._id}`, createNotification);
    });
  }

  //firebase
  const message = {
    notification: {
      title: `${payload.offerTitle}`,
      body: `A new offer is available for you`,
    },
    tokens: users
      .map(user => user.deviceToken)
      .filter((token): token is string => !!token),
  };

  //firebase
  firebaseHelper.sendPushNotifications(message);

  return createOffer;
};

const getOfferFromDB = async (): Promise<IOffer[]> => {
  const result = await Offer.find();
  return result;
};

const getSingleOfferFromDB = async (id: string): Promise<IOffer | null> => {
  const result = await Offer.findById(id);
  return result;
};

const updateOfferToDB = async (
  id: string,
  payload: IOffer,
): Promise<IOffer | null> => {
  const isExistOffer = await Offer.findById(id);
  if (!isExistOffer) {
    throw new ApiError(StatusCodes.OK, "Offer doesn't exist!");
  }

  //delete file from local
  if (payload.offerImage) {
    unlinkFile(isExistOffer.offerImage);
  }

  const updatedOffer = await Offer.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return updatedOffer;
};

const deleteOfferToDB = async (id: string) => {
  const isExistOffer = await Offer.findById(id);
  if (!isExistOffer) {
    throw new ApiError(StatusCodes.OK, "Offer doesn't exist!");
  }
  //delete file from local
  unlinkFile(isExistOffer.offerImage);

  const deleteOffer = await Offer.findByIdAndDelete(id);
  return deleteOffer;
};

export const OfferService = {
  createOfferToDB,
  getOfferFromDB,
  updateOfferToDB,
  deleteOfferToDB,
  getSingleOfferFromDB,
};

import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../util/unlinkFile';
import { Notification } from '../notification/notification.model';
import { User } from '../user/user.model';
import { IPatient } from './patient.interface';
import { Patient } from './patient.model';

const patientUpdateToDB = async (
  user: JwtPayload,
  payload: Partial<IPatient>,
) => {
  const isExistUser = await User.isUserExistById(user.id);

  //find patient
  const isExistPatient = await Patient.findById(isExistUser.patient);
  if (!isExistPatient) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Patient doesn't exist");
  }
  const { age, category, dateOfBirth, plan } = payload;
  if (age || category || dateOfBirth || plan) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Changes to age, category, date of birth, gender, or plan are not permitted.',
    );
  }

  //unlink profile
  if (payload.profile) {
    unlinkFile(isExistPatient?.profile);
  }

  //update profile
  const updateData = {
    name: payload.name,
    contactNo: payload.contactNo,
    profile: payload.profile,
  };

  let updateProfile = await Patient.findOneAndUpdate(
    {
      _id: isExistUser?.patient,
    },
    updateData,
    { new: true },
  );

  //notification
  //@ts-ignore
  const socketIO = global.io;
  const createNotification = await Notification.create({
    message: `${payload.name ? payload.name : isExistPatient.name} has updated their profile.`,
    image: `${payload.profile ? payload.profile : isExistPatient.profile}`,
    type: 'profile',
    role: 'admin',
  });

  if (socketIO) {
    socketIO.emit('admin-notifications', createNotification);
  }

  return updateProfile;
};

export const PatientService = {
  patientUpdateToDB,
};

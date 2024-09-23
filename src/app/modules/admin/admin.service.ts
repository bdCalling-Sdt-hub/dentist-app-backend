import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../util/unlinkFile';
import { User } from '../user/user.model';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const adminServiceToDB = async (user: JwtPayload, payload: Partial<IAdmin>) => {
  const isExistUser = await User.isUserExistById(user.id);

  //find patient
  const isExistAdmin = await Admin.findById(isExistUser.admin);
  if (!isExistAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Admin  doesn't exist");
  }
  const { age, dateOfBirth } = payload;
  if (age || dateOfBirth) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Changes to this field are not permitted.',
    );
  }

  //unlink profile
  if (payload.profile) {
    unlinkFile(isExistAdmin?.profile);
  }

  //update profile
  const updateData = {
    name: payload.name,
    contactNo: payload.contactNo,
    profile: payload.profile,
  };

  let updateProfile = await Admin.findOneAndUpdate(
    {
      _id: isExistUser?.admin,
    },
    updateData,
    { new: true },
  );

  return updateProfile;
};

export const AdminService = {
  adminServiceToDB,
};

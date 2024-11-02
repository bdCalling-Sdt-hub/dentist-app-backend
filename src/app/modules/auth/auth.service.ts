import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { USER_TYPE } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { IChangePassword } from '../../../types/authTypes';
import cryptoHexToken from '../../../util/cryptoHexToken';
import { Notification } from '../notification/notification.model';
import { ResetToken } from '../resetToken/resetToken.model';
import { IForgetPassword, IUser, IVerifyOtp } from '../user/user.interface';
import { User } from './../user/user.model';

const loginUserFromDB = async (payload: Partial<IUser>) => {
  const { email, pin, password, deviceToken } = payload;
  const isUserExist = await User.findOne({ email }).select('+password +pin');
  if (!isUserExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  console.log('new', deviceToken);

  if (isUserExist.status === 'delete') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You don’t have permission to access this content.It looks like your account has been deactivated.',
    );
  }

  const isMatchPassword = await bcrypt.compare(password!, isUserExist.password);
  if (!isMatchPassword) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
  }

  if (pin && isUserExist.role === USER_TYPE.PATIENT) {
    if (pin !== isUserExist.pin) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Pin is incorrect!');
    }
  }

  //save device token
  const update = await User.findOneAndUpdate(
    { _id: isUserExist._id },
    { deviceToken: deviceToken },
    { new: true },
  );

  console.log('updateDb', update);

  //jwt sign
  const createToken = jwtHelper.createToken(
    { id: isUserExist._id, email: isUserExist.email, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expire_in as string,
  );

  return { createToken };
};

const forgetPasswordToDB = async (payload: IForgetPassword) => {
  const { email } = payload;
  const isExistUser = await User.isUserExistByEmail(email);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.OK, "User doesn't exist!");
  }

  //notification
  //@ts-ignore
  const socketIO = global.io;
  const createNotification = await Notification.create({
    message: `<span style="color:#04aa6d;font-weight:bold">${email}</span> request to reset his password`,
    type: 'reset',
    role: 'admin',
  });

  if (socketIO) {
    socketIO.emit('admin-notifications', createNotification);
  }
};

// const forgetPasswordToDB = async (payload: IForgetPassword) => {
//   const { email } = payload;
//   const isExistUser = await User.isUserExistByEmail(email);
//   if (!isExistUser) {
//     throw new ApiError(StatusCodes.OK, "User doesn't exist!");
//   }

//   //otp generate
//   const otp = generateOTP();

//   //send email
//   const data = {
//     email,
//     otp: otp.toString(),
//   };
//   const mailData = emailTemplate.forgetPassword(data);
//   emailHelper.sendMail(mailData);

//   //save to db
//   const authentication = {
//     oneTimeCode: otp,
//     expiresAt: new Date(Date.now() + 3 * 60000),
//   };
//   await User.findOneAndUpdate({ email: email }, { $set: { authentication } });
// };

const verifyOtpToDB = async (payload: IVerifyOtp) => {
  const { email, otp } = payload;

  //user
  const isExistUser = await User.findOne({ email }).select('+authentication');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.OK, "User doesn't exist!");
  }

  //otp
  if (!otp) {
    throw new ApiError(
      StatusCodes.OK,
      'Please give the otp, check your email we send a code',
    );
  }
  if (otp !== isExistUser?.authentication?.oneTimeCode) {
    throw new ApiError(StatusCodes.OK, 'You provide wrong api');
  }

  const date = new Date();
  if (date > isExistUser?.authentication?.expiresAt) {
    throw new ApiError(
      StatusCodes.OK,
      'Otp already expired, Please click resend',
    );
  }
  const authentication = {
    isResetPassword: true,
    oneTimeCode: null,
    expiresAt: null,
  };
  const updateUser = await User.findOneAndUpdate(
    { _id: isExistUser._id },
    {
      $set: { authentication },
    },
  );

  //create token;
  const createToken = cryptoHexToken();

  await ResetToken.create({
    user: updateUser?._id,
    token: createToken,
    expiresAt: new Date(Date.now() + 5 * 60000),
  });

  return createToken;
};

const resetPasswordToDB = async (payload: any) => {
  const { email, password, pin } = payload;
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  // console.log(isUserExist);

  //password check
  // if (newPassword !== confirmPassword) {
  //   throw new ApiError(
  //     StatusCodes.BAD_REQUEST,
  //     "Password and confirm password doesn't exist",
  //   );
  // }

  //hash password
  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const updateData = {
    password: hashPassword,
    pin: pin,
  };

  await User.findOneAndUpdate({ email }, updateData, {
    new: true,
  });
};

//user change password
const changePasswordToDB = async (
  user: JwtPayload,
  payload: IChangePassword,
) => {
  const { newPassword, currentPassword, confirmPassword } = payload;
  const isUserExist = await User.findById(user.id).select('+password');
  if (!isUserExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist");
  }

  //password check
  const isMatchPassword = await User.isMatchPassword(
    currentPassword,
    isUserExist.password,
  );
  if (isUserExist.password && !isMatchPassword) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
  }

  if (newPassword === currentPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please give different password some current password',
    );
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Password and confirm password doesn't match",
    );
  }

  //hash password
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const updateData = {
    password: hashPassword,
  };
  await User.findOneAndUpdate({ _id: user.id }, updateData, { new: true });
};

export const AuthService = {
  loginUserFromDB,
  changePasswordToDB,
  forgetPasswordToDB,
  verifyOtpToDB,
  resetPasswordToDB,
};

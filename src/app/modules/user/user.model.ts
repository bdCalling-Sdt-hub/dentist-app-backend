import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      select: 0,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    status: {
      type: String,
      enum: ['active', 'delete'],
      default: 'active',
    },
    deviceToken: {
      type: String,
    },
    authentication: {
      type: {
        isResetPassword: {
          type: Boolean,
          default: false,
        },
        oneTimeCode: {
          type: String,
          default: null,
        },
        expiresAt: {
          type: Date,
          default: null,
        },
      },
      select: 0,
    },
  },
  { timestamps: true },
);

//user check
userSchema.statics.isUserExistById = async (id: string) => {
  return await User.findById(id);
};

userSchema.statics.isUserExistByEmail = async (email: string) => {
  return await User.findOne({ email: email });
};

//password match
userSchema.statics.isMatchPassword = async (
  password: string,
  hashPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

//delete user
userSchema.statics.deleteUser = async id => {
  return await User.findOneAndUpdate(
    { _id: id },
    { status: 'delete' },
    { new: true },
  );
};

// password hash
userSchema.pre('save', async function (next) {
  const user = this;

  const isExist = await User.findOne({ email: user.email });
  if (isExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'User already exist, please pick different email address',
    );
  }
  //password hash
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  //pin hash
  //user.pin = await bcrypt.hash(user.pin!, Number(config.bcrypt_salt_rounds))

  next();
});

export const User = model<IUser, UserModel>('User', userSchema);

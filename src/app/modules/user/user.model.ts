import bcrypt from 'bcrypt'
import { model, Schema } from 'mongoose'
import config from '../../../config'
import { IUser, UserModel } from './user.interface'

const userSchema = new Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      required: true,
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
)

//user check
userSchema.statics.isUserExistById = async (id: string) => {
  return await User.findById(id)
}

userSchema.statics.isUserExistByEmail = async (email: string) => {
  return await User.findOne({ email: email })
}

//password match
userSchema.statics.isMatchPassword = async (
  password: string,
  hashPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword)
}

// password hash
userSchema.pre('save', async function (next) {
  const user = this
  //password hash
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  )
  //pin hash
  //user.pin = await bcrypt.hash(user.pin!, Number(config.bcrypt_salt_rounds))

  next()
})

export const User = model<IUser, UserModel>('User', userSchema)

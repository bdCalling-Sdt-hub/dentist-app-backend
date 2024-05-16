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
    },
    role: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
    },
    status: {
      type: String,
      enum: ['active', 'delete'],
      default: 'active',
    },
  },
  { timestamps: true },
)

//user check
userSchema.statics.isUserExist = async (id: string) => {
  return await User.findById(id)
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
  user.pin = await bcrypt.hash(user.pin, Number(config.bcrypt_salt_rounds))

  next()
})

export const User = model<IUser, UserModel>('User', userSchema)

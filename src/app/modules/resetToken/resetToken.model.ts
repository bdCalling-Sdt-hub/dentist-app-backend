import { model, Schema } from 'mongoose'
import { IRsetToken, ResetTokenModel } from './resetToken.interface'

const resetTokenSchema = new Schema<IRsetToken, ResetTokenModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
)

//exist token
resetTokenSchema.statics.isTokenExist = async (token: string) => {
  return await ResetToken.findOne({ token })
}

//check match token
resetTokenSchema.statics.isTokenExpire = async (token: string) => {
  const currentDate = new Date()
  const resetToken = await ResetToken.findOne({
    token,
    expiresAt: { $gt: currentDate },
  })
  return !!resetToken
}

export const ResetToken = model<IRsetToken, ResetTokenModel>(
  'ResetToken',
  resetTokenSchema,
)

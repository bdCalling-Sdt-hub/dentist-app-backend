import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import { JwtPayload, Secret } from 'jsonwebtoken'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import { emailHelper } from '../../../helpers/emailHelper'
import { jwtHelper } from '../../../helpers/jwtHelper'
import { emailTemplate } from '../../../shared/emailTemplate'
import { IChangePassword } from '../../../types/authTypes'
import generateOTP from '../../../util/generateOTP'
import { IForgetPassword, IUser, IVerifyOtp } from '../user/user.interface'
import { User } from '../user/user.model'

const loginUserFromDB = async (payload: Partial<IUser>) => {
  const { email, pin, password } = payload

  const isUserExist = await User.findOne({ email }).select('+password +pin')
  if (!isUserExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!")
  }

  const isMatchPassword = await bcrypt.compare(password!, isUserExist.password)
  if (!isMatchPassword) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!')
  }

  const isMatchPin = await bcrypt.compare(pin!, isUserExist.pin!)
  if (!isMatchPin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Pin is incorrect!')
  }

  //jwt sign
  const createToken = jwtHelper.createToken(
    { id: isUserExist._id, email: isUserExist.email, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expire_in as string,
  )

  return { createToken }
}

const forgetPasswordToDB = async (payload: IForgetPassword) => {
  const { email } = payload
  const isExistUser = await User.isUserExistByEmail(email)
  if (!isExistUser) {
    throw new ApiError(StatusCodes.OK, "User doesn't exist!")
  }

  //otp generate
  const otp = generateOTP()

  //save to db
  const authentication = {
    oneTimeCode: otp,
    expiresAt: new Date(Date.now() + 3 * 60000),
  }
  await User.findOneAndUpdate({ email: email }, { $set: { authentication } })

  //send email
  const data = {
    email,
    otp: otp.toString(),
  }
  const mailData = emailTemplate.forgetPassword(data)
  emailHelper.sendMail(mailData)
}

const verifyOtpToDB = async (payload: IVerifyOtp) => {
  const { email, otp } = payload
  //user
  const isExistUser = await User.isUserExistByEmail(email)
  if (!isExistUser) {
    throw new ApiError(StatusCodes.OK, "User doesn't exist!")
  }
  //otp
  if (!otp) {
    throw new ApiError(StatusCodes.OK, 'Please give the otp')
  }
}

const changePasswordToDB = async (
  user: JwtPayload,
  payload: IChangePassword,
) => {
  const { newPassword, currentPassword, confirmPassword } = payload
  const isUserExist = await User.isUserExistById(user.id)
  if (!isUserExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist")
  }

  //password check
  const isMatchPassword = await User.isMatchPassword(
    newPassword,
    currentPassword,
  )
  if (currentPassword && !isMatchPassword) {
    if (!isUserExist) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!')
    }
  }

  //hash password
  const hashPassword = bcrypt.hash(
    newPassword,
    config.bcrypt_salt_rounds as string,
  )

  const updateData = {
    password: hashPassword,
  }
  await User.findOneAndUpdate({ _id: user.id }, updateData, { new: true })
}

export const AuthService = {
  loginUserFromDB,
  changePasswordToDB,
  forgetPasswordToDB,
  verifyOtpToDB,
}

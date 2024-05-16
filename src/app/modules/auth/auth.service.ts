import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import { JwtPayload, Secret } from 'jsonwebtoken'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import { jwtHelper } from '../../../helpers/jwtHelper'
import { IUser } from '../user/user.interface'
import { User } from '../user/user.model'

const loginUserFromDB = async (payload: Partial<IUser>) => {
  const { email, pin, password } = payload

  const isUserExist = await User.findOne({ email })
  if (!isUserExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!")
  }

  const isMatchPassword = await bcrypt.compare(password!, isUserExist.password)
  if (!isMatchPassword) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!')
  }

  const isMatchPin = await bcrypt.compare(pin!, isUserExist.pin)
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

type IChangePassword = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const changePasswordToDB = async (
  user: JwtPayload,
  payload: IChangePassword,
) => {
  const { newPassword, currentPassword, confirmPassword } = payload
  const isUserExist = await User.isUserExist(user.id)
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
}

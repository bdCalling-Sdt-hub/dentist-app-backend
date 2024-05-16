import { StatusCodes } from 'http-status-codes'
import { JwtPayload } from 'jsonwebtoken'
import mongoose from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { IPatient } from '../patient/patient.interface'
import { Patient } from '../patient/patient.model'
import { IUser } from './user.interface'
import { User } from './user.model'
type IUserPayload = IUser & IPatient

const createPatientToDB = async (payload: IUserPayload) => {
  const { email, password, pin, ...patientData } = payload
  const user: IUser = {
    email,
    password,
    pin,
    role: 'patient',
  }

  console.log(user, patientData)

  let newUserData = null
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const createPatient = await Patient.create([patientData], { session })
    if (!createPatient.length) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create patient')
    }

    user.patient = createPatient[0]._id
    const createUser = await User.create([user], { session })
    if (!createUser.length) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user')
    }

    newUserData = createUser[0]

    await session.commitTransaction()
    await session.endSession()
  } catch (error: any) {
    console.log(error)
    await session.abortTransaction()
    await session.endSession()
    throw new ApiError(StatusCodes.BAD_REQUEST, error?.message)
  }

  return newUserData
}

const getProfileFromDB = async (payload: JwtPayload) => {
  const result = await User.findOne({ _id: payload.id })
    .populate({ path: 'patient' })
    .select('-password -pin')
  return result
}

export const UserService = {
  createPatientToDB,
  getProfileFromDB,
}

import { StatusCodes } from 'http-status-codes'
import { JwtPayload } from 'jsonwebtoken'
import mongoose, { SortOrder } from 'mongoose'
import { USER_TYPE } from '../../../enums/user'
import ApiError from '../../../errors/ApiError'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../types/common'
import { IPaginationOptions } from '../../../types/pagination'
import { Admin } from '../admin/admin.model'
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

const getAllPatientFromDB = async (
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IUser[]>> => {
  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions)

  const sortCondition: { [key: string]: SortOrder } = {}
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder
  }
  const result = await User.find({ role: USER_TYPE.PATIENT })
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)

  const total = await User.countDocuments({ role: USER_TYPE.PATIENT })
  const totalPage = Math.ceil(total / limit)
  return {
    meta: {
      page,
      limit,
      totalPage,
      total,
    },
    data: result,
  }
}

//admin management
const createAdminToDB = async (payload: IUserPayload) => {
  const { email, password, pin, ...adminData } = payload
  const user: IUser = {
    email,
    password,
    pin,
    role: 'admin',
  }

  let newUserData = null
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const createAdmin = await Admin.create([adminData], { session })
    if (!createAdmin.length) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create admin')
    }

    user.admin = createAdmin[0]._id
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

const getAllAdminFromDB = async (
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IUser[]>> => {
  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions)

  const sortCondition: { [key: string]: SortOrder } = {}
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder
  }
  const result = await User.find({ role: USER_TYPE.ADMIN })
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)

  const total = await User.countDocuments({ role: USER_TYPE.ADMIN })
  const totalPage = Math.ceil(total / limit)
  return {
    meta: {
      page,
      limit,
      totalPage,
      total,
    },
    data: result,
  }
}

const getProfileFromDB = async (payload: JwtPayload) => {
  const result = await User.findOne({ _id: payload.id })
    .populate(['patient', 'admin'])
    .select('-password -pin')
  return result
}

export const UserService = {
  createPatientToDB,
  getProfileFromDB,
  createAdminToDB,
  getAllAdminFromDB,
  getAllPatientFromDB,
}

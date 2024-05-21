import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import { paginationFields } from '../../../shared/constant'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { UserService } from './user.service'

//patient
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body
  const result = await UserService.createPatientToDB(userData)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Patient accounted created successfully',
    data: result,
  })
})

const getAllPatient = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields)
  const result = await UserService.getAllPatientFromDB(paginationOptions)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All Patient retrieved successfully',
    pagination: result.meta,
    data: result.data,
  })
})

//admin management
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body
  const result = await UserService.createAdminToDB(userData)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin accounted created successfully',
    data: result,
  })
})

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields)
  const result = await UserService.getAllAdminFromDB(paginationOptions)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All Admin retrieved successfully',
    pagination: result.meta,
    data: result.data,
  })
})

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await UserService.deleteAdminFromDB(id)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin deleted successfully',
    data: result,
  })
})

//profile
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const result = await UserService.getProfileFromDB(user)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile data retrieved successfully',
    data: result,
  })
})

export const UserController = {
  createPatient,
  createAdmin,
  getAllAdmin,
  getProfile,
  getAllPatient,
  deleteAdmin,
}

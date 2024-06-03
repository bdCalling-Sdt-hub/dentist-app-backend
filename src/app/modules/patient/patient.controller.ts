import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { PatientService } from './patient.service'

const patientUpdate = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  let profile
  if (req.files && 'profile' in req.files && req.files.profile[0]) {
    profile = `/images/${req.files.profile[0].filename}`
  }
  const payload = {
    profile,
    ...req.body,
  }

  const result = await PatientService.patientUpdateToDB(user, payload)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  })
})

export const PatientController = {
  patientUpdate,
}

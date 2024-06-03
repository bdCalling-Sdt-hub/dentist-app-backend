import { StatusCodes } from 'http-status-codes'
import { JwtPayload } from 'jsonwebtoken'
import ApiError from '../../../errors/ApiError'
import unlinkFile from '../../../util/unlinkFile'
import { User } from '../user/user.model'
import { IPatient } from './patient.interface'
import { Patient } from './patient.model'

const patientUpdateToDB = async (
  user: JwtPayload,
  payload: Partial<IPatient>,
) => {
  const isExistUser = await User.isUserExistById(user.id)

  //find patient
  const isExistPatient = await Patient.findById(isExistUser.patient)
  if (!isExistPatient) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Patient doesn't exist")
  }
  const { age, category, dateOfBirth, gender, plan } = payload
  if (age || category || dateOfBirth || gender || plan) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Changes to this field are not permitted.',
    )
  }

  //unlink profile
  if (payload.profile) {
    unlinkFile(isExistPatient?.profile)
  }

  //update profile
  const updateData = {
    name: payload.name,
    contactNo: payload.contactNo,
    profile: payload.profile,
  }

  let updateProfile = await Patient.findOneAndUpdate(
    {
      _id: isExistUser?.patient,
    },
    updateData,
    { new: true },
  )

  return updateProfile
}

export const PatientService = {
  patientUpdateToDB,
}

import { Model } from 'mongoose'

export type IPatient = {
  name: string
  contactNo: string
  age: number
  dateOfBirth: string
  gender: 'male' | 'female'
  plan: string
  category: string
  profile: string
}

export type PatientModel = {} & Model<IPatient>

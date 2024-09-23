import { Model } from 'mongoose';

export type IPatient = {
  name: string;
  surname: string;
  contactNo: string;
  age: number;
  dateOfBirth: string;
  plan: string;
  category: string;
  profile: string;
};

export type PatientModel = {} & Model<IPatient>;

export type IPatientFilterOptions = {
  search?: string;
  category?: string;
};

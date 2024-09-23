import { model, Schema } from 'mongoose';
import { IPatient, PatientModel } from './patient.interface';

const patientSchema = new Schema<IPatient, PatientModel>(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      default: 'https://i.postimg.cc/SsDP2qqv/profile.png',
    },
  },
  { timestamps: true },
);

export const Patient = model<IPatient, PatientModel>('Patient', patientSchema);
